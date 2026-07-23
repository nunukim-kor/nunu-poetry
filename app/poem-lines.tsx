export default function PoemLines({ lines }: { lines: string[] }) {
  return <>{lines.map((line, index) => <span className="poem-line" key={index}>{line || "\u00a0"}</span>)}</>;
}
