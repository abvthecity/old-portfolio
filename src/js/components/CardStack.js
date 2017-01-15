import React, { Component } from 'React';
import classNames from 'classnames';
import { Motion, StaggeredMotion, spring, presets } from 'react-motion';

import Card from './Card';

class CardStack extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rotate: {x: 0, y: 0, z: 0},
      mouse: {x: 0, y: 0},
      delta: {x: 0, y: 0},
      isPickedUp: false,
      isHovering: false,
      isMoved: 0
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseUpFromCard = this.handleMouseUpFromCard.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.getStyles = this.getStyles.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown({ clientX, clientY, pageX, pageY }) {
    console.log("PICKED UP", clientX, clientY, pageX, pageY);
    this.setState({
      isPickedUp: true,
      isMoved: 0,
      delta: { x: clientX, y: clientY },
      mouse: { x: pageX - clientX, y:  pageY - clientY}
    })
  }

  handleMouseUp() {
    console.log("PUT DOWN");
    const { isPickedUp } = this.state;
    if (isPickedUp) {
      this.setState({
        isPickedUp: false,
        isMoved: 0,
        delta: {x: 0, y: 0},
        mouse: {x: 0, y: 0}
      });
    }
  }

  handleMouseUpFromCard() {
    const { onClickCallback } = this.props;
    const { isMoved } = this.state;
    if (isMoved < 10) onClickCallback();
  }

  handleMouseMove({ pageX, pageY }) {
    const { delta, isPickedUp, isHovering } = this.state;
    const globalMouse = { x: pageX, y: pageY };

    const mouse = {
      x: pageX - delta.x,
      y: pageY - delta.y
    };

    const cardStackPos = this.cardStackDiv.getBoundingClientRect();
    const offsetX = globalMouse.x - (cardStackPos.left + (cardStackPos.width / 2)),
          offsetY = globalMouse.y - (cardStackPos.top + (cardStackPos.height / 2));
    const rotate = {
      y: offsetX * 0.025,
      x: offsetY * -0.025,
      z: offsetX * 0.025 + offsetY * 0.001
    };

    if (isPickedUp) {
      this.setState({ mouse, rotate, isMoved: this.state.isMoved + 1 });
    } else {
      this.setState({ rotate });
    }
  }

  getStyles(prevStyles) {
    const { mouse, isPickedUp, isHovering } = this.state;
    return prevStyles.map((_, i) => {
      const scale = (!isPickedUp) ? 1.0 : 1.1;
      const springConfig = {stiffness: 400 + i * 150, damping: 20 + i * 10, precision: 0.005};
      return i === 0 ? {
        x: spring(mouse.x, springConfig),
        y: spring(mouse.y, springConfig),
        scale: spring(scale, springConfig)
      } : {
        x: spring(prevStyles[i - 1].x, springConfig),
        y: spring(prevStyles[i - 1].y, springConfig),
        scale: spring(scale, springConfig)
      };
    });
  }

  render() {
    const { cards, name, sub, opacity, transition, onClickCallback, ...props } = this.props;
    const { rotate, delta, isPickedUp, isHovering } = this.state;

    return (
      <Motion style={{
        x: (isHovering || isPickedUp) ? spring(0) : spring(rotate.x),
        y: (isHovering || isPickedUp) ? spring(0) : spring(rotate.y),
        z: (!isPickedUp) ? spring(0) : spring(rotate.z)
      }}>
        {rotation =>
          <StaggeredMotion
            defaultStyles={cards.map(() => ({ x: 0, y: 0, scale: 1.0 }))}
            styles={this.getStyles}>
            {interpolatingStyles =>
              <div className={classNames('card-stack-container', {'picked-up': isPickedUp})} {...props}>
                <div className={classNames('card-stack')}
                  ref={div => { this.cardStackDiv = div; }}
                  style={{
                    transform: `rotateX(${rotation.x * transition}deg) rotateY(${rotation.y * transition}deg) rotateZ(${rotation.z * transition}deg)`
                  }}
                  onMouseOver={e => this.setState({ isHovering: true })}
                  onMouseOut={e => this.setState({ isHovering: false })}
                  onMouseDown={this.handleMouseDown}
                  onMouseUp={this.handleMouseUpFromCard}>
                  {interpolatingStyles.map(({x, y, scale}, i) =>
                    <div key={i} className='card' style={{
                      transform: `translate3d(${x * transition}px, ${(y + (cards.length - i) * -12) * transition}px, ${(cards.length - i) * 24 * transition}px) scale(${scale})`,
                      zIndex: cards.length - i,
                      opacity: opacity
                    }}>
                      <div className='card-img' style={{ backgroundImage: `url(images/${cards[i]})`}} />
                    </div>
                  )}
                </div>
                <div className='card-container-label'>
                  <div className='card-name' style={{ opacity: transition * 0.2 }}>{name}</div>
                  <div className='card-sub' style={{ opacity: transition * 0.2 }}>{sub}</div>
                </div>
              </div>
            }
          </StaggeredMotion>
        }
      </Motion>
    );
  }

}

export default CardStack;
