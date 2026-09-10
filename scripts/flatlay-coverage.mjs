// Simulate the finished flat-lay locally and ask the only question that
// matters: at PLACE_END, is any of the man still showing?
import fs from 'node:fs';
import sharp from 'sharp';

const W = 1080, H = 1920;
const L = JSON.parse(fs.readFileSync('src/compositions/episode04/shot00/layout.json', 'utf8'));
const A = (n) => `public/cutouts-alpha/${n}.png`;

const place = async (p) => {
	const m = await sharp(A(p.asset)).metadata();
	const w = Math.round(p.w);
	const h = Math.round(p.w / (m.width / m.height));
	let img = sharp(A(p.asset)).resize(w, h, {fit: 'fill'});
	if (p.rot) img = img.rotate(p.rot, {background: {r: 0, g: 0, b: 0, alpha: 0}});
	let buf = await img.png().toBuffer();
	const bm = await sharp(buf).metadata();
	// CSS rotate() spins about the element centre and leaves the layout box
	// alone, so re-centre sharp's expanded canvas on the same point.
	let left = Math.round(p.x - bm.width / 2);
	let top = Math.round(p.y - bm.height / 2);
	// sharp refuses a composite input that hangs off the base, so clip each
	// piece to the frame first. The frame is what we are measuring anyway.
	const cx0 = Math.max(0, -left), cy0 = Math.max(0, -top);
	const cx1 = Math.min(bm.width, W - left), cy1 = Math.min(bm.height, H - top);
	if (cx1 <= cx0 || cy1 <= cy0) return null;
	if (cx0 || cy0 || cx1 !== bm.width || cy1 !== bm.height) {
		buf = await sharp(buf)
			.extract({left: cx0, top: cy0, width: cx1 - cx0, height: cy1 - cy0})
			.png().toBuffer();
		left += cx0;
		top += cy0;
	}
	return {buf, left, top};
};

const alphaOf = async (buf, w, h, left, top) => {
	const base = sharp({create: {width: w, height: h, channels: 4, background: {r:0,g:0,b:0,alpha:0}}});
	return base.composite([{input: buf, left, top}]).raw().toBuffer({resolveWithObject: true});
};

const run = async () => {
	// The man's own silhouette, at his rendered size and position.
	const s = L.subject;
	const sm = await sharp(A(s.asset)).metadata();
	const sh = Math.round(s.w / (sm.width / sm.height));
	const sBuf = await sharp(A(s.asset)).resize(s.w, sh, {fit: 'fill'}).png().toBuffer();
	const sLeft = Math.round(s.x - s.w/2), sTop = Math.round(s.y - sh/2);
	const sub = await alphaOf(sBuf, W, H, sLeft, sTop);

	/**
	 * Anything else that must be buried with him. The nameplate is a plain
	 * rectangle drawn in Remotion rather than a cutout, but the pile has to
	 * cover it just as completely -- and the top of the frame is exactly where
	 * that is least certain, because the piece nominally covering it is the
	 * grille, whose bar gaps are transparent by design.
	 */
	const rects = L.subjectRects ?? [];

	// Everything laid on top of him.
	const comps = [];
	for (const p of L.pieces) {
		const c = await place(p);
		if (c) comps.push(c);
	}
	const cov = await sharp({create: {width: W, height: H, channels: 4, background: {r:0,g:0,b:0,alpha:0}}})
		.composite(comps.map((c) => ({input: c.buf, left: c.left, top: c.top})))
		.raw().toBuffer({resolveWithObject: true});

	const sd = sub.data, cd = cov.data, ch = 4;
	const inRect = (x, y) =>
		rects.some((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h);
	let subjectPx = 0, exposed = 0, framePx = 0, frameCovered = 0;
	const exposeMask = Buffer.alloc(W * H);
	for (let i = 0; i < W * H; i++) {
		const x = i % W, y = (i / W) | 0;
		const sa = sd[i*ch+3], ca = cd[i*ch+3];
		if (ca > 40) frameCovered++;
		framePx++;
		if (sa > 40 || inRect(x, y)) {
			subjectPx++;
			if (ca <= 40) { exposed++; exposeMask[i] = 255; }
		}
	}
	console.log(`frame covered      ${(100*frameCovered/framePx).toFixed(1)}%`);
	console.log(`subject pixels     ${subjectPx}`);
	console.log(`STILL SHOWING      ${exposed}  (${(100*exposed/subjectPx).toFixed(2)}% of him)`);

	// Where, so a gap can be fixed rather than guessed at.
	if (exposed) {
		let x0=W,x1=0,y0=H,y1=0;
		for (let y=0;y<H;y++) for (let x=0;x<W;x++) if (exposeMask[y*W+x]) {
			if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y;
		}
		console.log(`exposed bbox       x ${x0}-${x1}  y ${y0}-${y1}`);
	}

	// A picture of it: him in red, the pile over the top.
	let red = await sharp(sBuf).ensureAlpha().tint({r:255,g:0,b:0}).png().toBuffer();
	let rl = sLeft, rt = sTop;
	const rm = await sharp(red).metadata();
	const rx0 = Math.max(0, -rl), ry0 = Math.max(0, -rt);
	const rx1 = Math.min(rm.width, W - rl), ry1 = Math.min(rm.height, H - rt);
	if (rx0 || ry0 || rx1 !== rm.width || ry1 !== rm.height) {
		red = await sharp(red).extract({left: rx0, top: ry0, width: rx1-rx0, height: ry1-ry0}).png().toBuffer();
		rl += rx0; rt += ry0;
	}
	for (const c of comps) {
		const m2 = await sharp(c.buf).metadata();
		if (c.left < 0 || c.top < 0 || c.left + m2.width > W || c.top + m2.height > H)
			console.log('OVERHANG', m2.width, m2.height, c.left, c.top);
	}
	const full = await sharp({create:{width:W,height:H,channels:3,background:'#e9dfc9'}})
		.composite([
			{input: red, left: rl, top: rt},
			...rects.map((r) => ({
				input: {
					create: {width: r.w, height: r.h, channels: 4, background: {r: 255, g: 0, b: 0, alpha: 1}},
				},
				left: r.x,
				top: r.y,
			})),
			...comps.map((c)=>({input:c.buf,left:c.left,top:c.top})),
		])
		.png().toBuffer();
	// sharp applies resize BEFORE composite whatever order you chain them in,
	// so the shrink has to be a second pass over the finished frame.
	await sharp(full).resize({width: 520}).png().toFile('coverage.png');
};
run();
