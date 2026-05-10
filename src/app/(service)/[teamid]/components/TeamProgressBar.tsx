import ProgressBar from '@ramonak/react-progress-bar';

export default function TeamProgressBar({ completed }: { completed: number }) {
  return (
    <>
      <ProgressBar
        completed={completed}
        bgColor="var(--color-brand-primary)"
        baseBgColor="var(--color-background-secondary)"
        height="100%"
        labelSize="0px"
        animateOnRender
        transitionDuration="1s"
      />
    </>
  );
}
