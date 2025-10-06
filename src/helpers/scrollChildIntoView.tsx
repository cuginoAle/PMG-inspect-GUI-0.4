// Scroll a child element into view within a scrollable container.
// Centers the child along the chosen axis and clamps within scrollable range.
type Props = {
  container: HTMLElement;
  child: HTMLElement;
  direction: 'vertical' | 'horizontal';
  behavior: ScrollBehavior;
};

const scrollChildIntoView = ({
  container,
  child,
  direction = 'horizontal',
  behavior = 'smooth',
}: Props) => {
  if (!container || !child) return;
  const containerRect = container.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  if (direction === 'horizontal') {
    // Child left relative to container's scrollable content
    const childLeft =
      childRect.left - containerRect.left + container.scrollLeft;
    const childCenter = childLeft + childRect.width / 2;
    let targetLeft = childCenter - container.clientWidth / 2;
    // Clamp within scroll range
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (targetLeft < 0) targetLeft = 0;
    if (targetLeft > maxScrollLeft) targetLeft = maxScrollLeft;
    container.scrollTo({ left: Math.round(targetLeft), behavior });
    return;
  }

  // Vertical
  const childTop = childRect.top - containerRect.top + container.scrollTop;
  const childCenterY = childTop + childRect.height / 2;
  let targetTop = childCenterY - container.clientHeight / 2;
  const maxScrollTop = container.scrollHeight - container.clientHeight;
  if (targetTop < 0) targetTop = 0;
  if (targetTop > maxScrollTop) targetTop = maxScrollTop;
  container.scrollTo({ top: Math.round(targetTop), behavior });
};

export { scrollChildIntoView };
