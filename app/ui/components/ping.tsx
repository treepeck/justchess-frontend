type Props = {
  delay: number;
};

export default function Ping({ delay }: Props) {
  return <div>Ping: {delay} ms</div>;
}
