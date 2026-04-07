import Chapter11 from "../chapters/Chapter11";
import Chapter12 from "../chapters/Chapter12";
import Chapter13 from "../chapters/Chapter13";
import Chapter21 from "../chapters/Chapter21";
import Chapter22 from "../chapters/Chapter22";
import Chapter23 from "../chapters/Chapter23";

const chapterComponents = {
  "1-1": Chapter11,
  "1-2": Chapter12,
  "1-3": Chapter13,
  "2-1": Chapter21,
  "2-2": Chapter22,
  "2-3": Chapter23,
};

export default function ContentArea({ chapter, module }) {
  const Component = chapterComponents[chapter.id];
  if (!Component) return <p className="text-center text-gray-400 py-20">Chapter not found.</p>;

  return <Component chapter={chapter} module={module} />;
}
