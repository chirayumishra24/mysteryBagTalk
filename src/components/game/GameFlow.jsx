import { useRef } from "react";
import ContentRenderer from "./ContentRenderer";
import HollowInteraction from "./HollowInteraction";

export default function GameFlow() {
  const challengeRef = useRef(null);

  const scrollToChallenge = () => {
    challengeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="w-full pb-20">
      <ContentRenderer onComplete={scrollToChallenge} />

      <section ref={challengeRef} className="scroll-mt-6 px-4 pb-6 md:px-6">
        <HollowInteraction />
      </section>
    </div>
  );
}
