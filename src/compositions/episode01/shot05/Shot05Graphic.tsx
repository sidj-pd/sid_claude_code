import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CollageBackdrop } from "../../../components/CollageBackdrop";
import { ArrowTag, EvidenceStamp } from "../../../components/EvidenceStamp";
import { NewsprintTexture } from "../../../components/NewsprintTexture";
import { VoiceOver } from "../../../components/VoiceOver";
import { tornPolygon } from "../../../components/tornEdge";
import { useStopMotionStep } from "../../../components/useStopMotionStep";
import {
  BAR1_STARTS,
  BAR2_STARTS,
  BAR_GROW,
  CAP1_IN,
  CAP2_IN,
  CUT_TO_BLACK,
  HEADER_IN,
  HEADER_STAMP,
  NUM1_STAMP,
  NUM2_STAMP,
  SLIVER_MOVE,
  SLIVER_MOVE_FRAMES,
  STEP,
  SUBHEAD_IN,
  TAG_STAMP,
  VO_A_STARTS,
  VO_B_STARTS,
  VO_C_STARTS,
} from "./beats";
import { StatBar } from "./StatBar";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const INK = "#241d15";

/** The survey's two findings. */
const REFUSE_ROUTE = 0.91;
const REFUSE_METER = 0.96;

// One column, so both bars are read against the same width, and set deep
// enough down the frame that the page fills a 9:16 crop rather than sitting
// in a band across the top of it.
const BAR_X = 84;
const BAR_W = 912;
const BAR_H = 196;
const BAR1_Y = 700;
const BAR2_Y = 1198;

/** Where the leftover 9% of the first bar sits, before it becomes the second. */
const SLIVER_X = BAR_X + REFUSE_ROUTE * BAR_W;
const SLIVER_W = BAR_W * (1 - REFUSE_ROUTE);

/**
 * Grows a value in stepped chunks rather than smoothly. Used for both bars,
 * so they fill the way a strip of paper gets torn to length — in bites.
 */
const useSteppedGrowth = (
  frame: number,
  start: number,
  duration: number,
): number => {
  const { steppedFrame } = useStopMotionStep(Math.max(0, frame - start), STEP);
  return interpolate(steppedFrame, [0, duration], [0, 1], CLAMP);
};

const Caption: React.FC<{ text: string; age: number; size?: number }> = ({
  text,
  age,
  size = 54,
}) => {
  if (age < 0) return null;
  return (
    <div
      style={{
        fontFamily: "RansomAnton, sans-serif",
        fontSize: size,
        letterSpacing: 1.5,
        color: INK,
        opacity: interpolate(age, [0, 2], [0, 1], CLAMP),
        transform: `translateY(${interpolate(age, [0, 3], [10, 0], CLAMP)}px)`,
      }}
    >
      {text}
    </div>
  );
};

/**
 * Shot 5 — The Graphic.
 *
 * A hard cut out of the meter and into the case file's evidence: a survey
 * page, read out. The register changes completely — no puppets, no depth,
 * everything flat on the page — which is what makes it land as a cutaway
 * rather than as more of the same scene.
 *
 * The two statistics are one object, not two. The 9% left over from the first
 * bar detaches and grows into the whole of the second, so the second figure
 * is visibly a slice of the first rather than a fresh claim. What survives at
 * the end is a sliver four percent wide, and the episode is about that
 * sliver — which is the cliffhanger, stated as a picture before it is stated
 * as a line.
 */
export const Shot05Graphic: React.FC = () => {
  const frame = useCurrentFrame();

  const bar1 = useSteppedGrowth(frame, BAR1_STARTS, BAR_GROW) * REFUSE_ROUTE;
  const bar2 = useSteppedGrowth(frame, BAR2_STARTS, BAR_GROW) * REFUSE_METER;

  /**
   * The sliver's journey to becoming the second bar. Stepped like everything
   * else, so it hops across the page rather than gliding.
   */
  const { steppedFrame: moveStep } = useStopMotionStep(
    Math.max(0, frame - SLIVER_MOVE),
    STEP,
  );
  const move = interpolate(moveStep, [0, SLIVER_MOVE_FRAMES], [0, 1], CLAMP);
  const showSliver = frame >= SLIVER_MOVE;
  const bar2X = interpolate(move, [0, 1], [SLIVER_X, BAR_X]);
  const bar2Y = interpolate(move, [0, 1], [BAR1_Y, BAR2_Y]);
  const bar2W = interpolate(move, [0, 1], [SLIVER_W, BAR_W]);

  // The last 4%: what the whole episode turns out to be about.
  const remainderX = bar2X + bar2W * REFUSE_METER;
  const remainderW = bar2W * (1 - REFUSE_METER);

  const blackout = interpolate(
    frame,
    [CUT_TO_BLACK, CUT_TO_BLACK + 1],
    [0, 1],
    CLAMP,
  );

  /**
   * The page breathes. Barely — a pixel and a fraction of a degree, on a slow
   * step grid. The script asks for the last stat card to be held frozen while
   * the narrator finishes, and a genuinely frozen frame stops reading as a
   * held shot and starts reading as a stalled render.
   */
  const { stepIndex: breath } = useStopMotionStep(frame, 9);
  const drift = `translate(${(breath % 3) - 1}px, ${(breath % 2) * 1.2 - 0.6}px) rotate(${((breath % 4) - 1.5) * 0.06}deg)`;

  return (
    <AbsoluteFill>
      <CollageBackdrop chaos={0.12} />
      {/* Ruled like a form, so the frame reads as a document rather than as
			    a slide. Faint enough to sit under everything. */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(180deg, transparent 0 46px, rgba(36,29,21,0.055) 46px 47px)`,
        }}
      />

      <AbsoluteFill style={{ transform: drift }}>
        {frame >= HEADER_IN ? (
          <div
            style={{
              position: "absolute",
              left: BAR_X,
              top: 196,
              width: BAR_W,
            }}
          >
            <div
              style={{
                background: "#efe4c8",
                padding: "34px 40px 40px",
                clipPath: tornPolygon({ seed: 3, depth: 4, teeth: 15 }),
                boxShadow: "0 8px 18px rgba(48,34,18,0.22)",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "RansomAnton, sans-serif",
                  fontSize: 96,
                  lineHeight: 0.96,
                  letterSpacing: 1,
                  color: INK,
                }}
              >
                AUTO DRIVERS
                <br />
                SURVEYED
              </div>
              {frame >= SUBHEAD_IN ? (
                <div
                  style={{
                    marginTop: 18,
                    fontFamily: "RansomSpecialElite, monospace",
                    fontSize: 32,
                    color: "rgba(36,29,21,0.72)",
                  }}
                >
                  n = 1,200 · METHODOLOGY UNAVAILABLE
                </div>
              ) : null}
              <NewsprintTexture opacity={0.18} />
            </div>

            <div style={{ position: "absolute", right: -26, top: -62 }}>
              <EvidenceStamp
                text={"EXHIBIT\nB"}
                age={frame - HEADER_STAMP}
                fontSize={40}
                rotate={7}
              />
            </div>
          </div>
        ) : null}

        {/* Claim one. The empty outline arrives a few frames ahead of the
			    fill, so the bar is a thing being measured rather than a thing
			    appearing already measured. */}
        {frame >= BAR1_STARTS - 6 ? (
          <div style={{ position: "absolute", left: BAR_X, top: BAR1_Y }}>
            <StatBar
              width={BAR_W}
              height={BAR_H}
              fill={bar1}
              label="91%"
              labelAge={frame - NUM1_STAMP}
              seed={5}
            />
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            left: BAR_X,
            top: BAR1_Y + BAR_H + 26,
          }}
        >
          <Caption text="REFUSE THE WHITEFIELD ROUTE" age={frame - CAP1_IN} />
        </div>

        {/* Claim two — the same 9%, enlarged. */}
        {showSliver ? (
          <>
            <div style={{ position: "absolute", left: bar2X, top: bar2Y }}>
              <StatBar
                width={bar2W}
                height={BAR_H}
                fill={bar2}
                label={move >= 1 ? "96%" : undefined}
                labelAge={frame - NUM2_STAMP}
                seed={11}
              />
            </div>
            {move >= 1 ? (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: BAR_X,
                    top: BAR2_Y - 60,
                  }}
                >
                  <Caption
                    text="OF THOSE WHO ACCEPT"
                    age={frame - SLIVER_MOVE - SLIVER_MOVE_FRAMES}
                    size={40}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: BAR_X,
                    top: BAR2_Y + BAR_H + 26,
                  }}
                >
                  <Caption text="REFUSE THE METER" age={frame - CAP2_IN} />
                </div>
              </>
            ) : null}
          </>
        ) : null}

        {/* What is left. The arrow runs up to the sliver from a tag sitting
			    below and to its left, because at four percent of the width there
			    is nowhere on the bar itself to put a label. */}
        {frame >= TAG_STAMP ? (
          <>
            <div
              style={{
                position: "absolute",
                left: remainderX - 4,
                top: BAR2_Y - 4,
                width: remainderW + 8,
                height: BAR_H + 8,
                border: "4px solid #8f3626",
                borderRadius: 3,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: remainderX - 152,
                top: BAR2_Y + BAR_H + 34,
              }}
            >
              <ArrowTag age={frame - TAG_STAMP} length={164} />
            </div>
            <div
              style={{
                position: "absolute",
                left: remainderX - 356,
                top: BAR2_Y + BAR_H + 206,
              }}
            >
              <EvidenceStamp
                text={"THIS RIDE"}
                age={frame - TAG_STAMP - 8}
                fontSize={48}
                rotate={-4}
              />
            </div>
          </>
        ) : null}

        {frame >= SUBHEAD_IN ? (
          <div
            style={{
              position: "absolute",
              left: BAR_X,
              top: 1766,
              width: BAR_W,
              background: "#e6dabb",
              padding: "18px 28px",
              clipPath: tornPolygon({ seed: 21, depth: 5, teeth: 15 }),
              fontFamily: "RansomSpecialElite, monospace",
              fontSize: 26,
              letterSpacing: 1,
              color: "rgba(36,29,21,0.7)",
            }}
          >
            SOURCE: BIZZARO BANGALORE FIELD UNIT · FILE 01
            <NewsprintTexture opacity={0.16} />
          </div>
        ) : null}
      </AbsoluteFill>

      <VoiceOver id="ep01-shot05a" from={VO_A_STARTS} />
      <VoiceOver id="ep01-shot05b" from={VO_B_STARTS} />
      <VoiceOver id="ep01-shot05c" from={VO_C_STARTS} />

      {/* Hard cut to black, then silence. One frame, no fade. */}
      {blackout > 0 ? (
        <AbsoluteFill
          style={{ backgroundColor: "#0b0906", opacity: blackout }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
