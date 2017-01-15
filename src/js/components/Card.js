import React, { Component } from 'React';
import classNames from 'classnames';
import { Motion, spring, presets } from 'react-motion';

class Card extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mouse: {x: 0, y: 0},
      delta: {x: 0, y: 0},
      rotate: {x: 0, y: 0, z: 0},
      isPickedUp: false,
      isHovering: false,
      isMoved: 0
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseUpFromCard = this.handleMouseUpFromCard.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
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

    const cardPos = this.cardDiv.getBoundingClientRect();
    const offsetX = globalMouse.x - (cardPos.left + (cardPos.width / 2)),
          offsetY = globalMouse.y - (cardPos.top + (cardPos.height / 2));
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

  render() {
    const { isPickedUp, isHovering, rotate, mouse } = this.state;
    const { src, name, sub, collapsed, opacity, ...props } = this.props;

    const scale = (!isPickedUp) ? 1.0 : 1.1;
    const springConfig = {stiffness: 400, damping: 20, precision: 0.005};

    return (
      <Motion style={{
        translateX: spring(mouse.x, springConfig),
        translateY: spring(mouse.y, springConfig),
        rotateX: (isHovering || isPickedUp || collapsed) ? spring(0) : spring(rotate.x),
        rotateY: (isHovering || isPickedUp || collapsed) ? spring(0) : spring(rotate.y),
        rotateZ: (!isPickedUp || collapsed) ? spring(0) : spring(rotate.z),
        scale: spring(scale, springConfig)
      }}>
        {({ translateX, translateY, rotateX, rotateY, rotateZ, scale}) =>
          <div className={classNames('card-single-container', {'picked-up': isPickedUp})} {...props}>
            <div className='card-single'
              ref={div => { this.cardDiv = div; }}
              style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)` }}
              onMouseOver={e => this.setState({ isHovering: true })}
              onMouseOut={e => this.setState({ isHovering: false })}
              onMouseDown={this.handleMouseDown}
              onMouseUp={this.handleMouseUpFromCard}>
              <div className='card' style={{ transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})` }}>
                <div className='card-img' style={{ backgroundImage: `url(images/${src})`}} />
              </div>
            </div>
            <div className='card-container-label'>
              <div className='card-name' style={{ opacity: 0.2 * opacity }}>{name}</div>
              <div className='card-sub' style={{ opacity: 0.2 * opacity }}>{sub}</div>
            </div>
          </div>
        }
      </Motion>
    );
  }
}

export default Card;
