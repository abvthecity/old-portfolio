import React, { Component } from 'React';
import { Motion, spring, presets } from 'react-motion';
// const PageTransition = require('react-router-page-transition').default(React, ReactDom);

import Card from '../components/card'

class Gallery extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      name: '',
      collapsed: true
    }
  }

  componentDidMount() {
    const id = this.props.params.galleryId;

    if (id == 'code') {
      this.setState({
        name: 'Code',
        cards: [
          {img: 'molly.jpg', name: 'Molly', sub: 'Dec 2016'},
          {img: 'ballotview.jpg', name: 'Ballotview', sub: 'Nov 2016', url: 'http://ballotview.org'},
          {img: 'hackschedule.jpg', name: 'HackSChedule', sub: 'Oct 2016', url: 'http://hackschedule.com'}
        ], collapsed: false
      });
    } else if (id == 'design') {
      this.setState({
        name: 'Design',
        cards: [
          {img: 'hacksc.jpg', name: 'HackSC', sub: '2017'},
          {img: 'lostintheworld.jpg', name: 'Lost in the World', sub: '2014-2015', url: 'https://medium.com/@abvthecity/lost-in-the-world-5fc8b2c9b145'},
          {img: 'cometogether.jpg', name: 'Come Together', sub: '2013-2014', url: 'https://medium.com/@abvthecity/come-together-a846edfbca05#.5br516od6'}
        ], collapsed: false
      });
    } else if (id == 'photo') {
      this.setState({
        name: 'Photo',
        cards: [
          {img: 'vsco.jpg', name: 'VSCO x Abvthecity', sub: 'Continuous', url: 'http://vsco.co/abvthecity/'},
          {img: 'china.jpg', name: 'China', sub: 'Summer 2015', url: 'https://goo.gl/photos/txvgTAVXhbXjbspe8'}
        ], collapsed: false
      });
    }
  }

  getDefaultStyle(index) {
    const containerPos = this.cardsContainer.getBoundingClientRect();
    const numberOfCardsPerRow = this.state.cards.length;
    const interval = containerPos.width / (numberOfCardsPerRow * 2);
    const desiredPosition = containerPos.width / 2;
    const xOffset = (desiredPosition - (interval * ((index + 1) * 2 - 1)));

    if (this.props.location.state) {
      const goBackInterval = containerPos.width/(this.props.location.state.goBackCardsPerRow * 2);
      const goBackOffset = desiredPosition - (goBackInterval * ((this.props.location.state.goBackIndex + 1) * 2 - 1));
      return { x: xOffset - goBackOffset, y: 0, opacity: 0 };
    } else {
      return { x: xOffset, y: 0 , opacity: 0 };
    }
  }

  render() {
    const { cards, name, collapsed } = this.state;

    return (
      <div id='gallery'>
        <div className='logo' onClick={() => {
          this.setState({ collapsed: true }, () => {
            setTimeout(() => {
              this.context.router.push({ pathname: '/', state: { goBackIndex: (this.props.location.state) ? this.props.location.state.goBackIndex : -1 } });
            }, 500);
          });
        }}><i class="material-icons">arrow_back</i> Andrew Jiang</div>
        <nav>
          <a href={'https://drive.google.com/file/d/0B8yzs98xLPTPR3JvY0JPSEhEYkk/view'} target='_blank'>Resume</a>
          <a href={'http://github.com/ninjiangstar'} target='_blank'>Github</a>
          <a href={'mailto:andrewji@usc.edu'} target='_blank'>Email</a>
        </nav>
        <div className='gallery-heading'>{name}</div>
          <div className='cards-container' ref={div => { this.cardsContainer = div; }}>
            {cards.map((card, i) => {
              const defaultStyle = this.getDefaultStyle(i);
              const springConfig = {stiffness: 200, damping: 17, precision: 0.005};
              return (<Motion key={i} defaultStyle={defaultStyle}
                style={{
                  x: (collapsed) ? spring(defaultStyle.x, springConfig) : spring(0, springConfig),
                  y: (collapsed) ? spring(defaultStyle.y, springConfig) : spring(0, springConfig),
                  opacity: (collapsed) ? spring(0) : spring(1)
                }}>
                {({x, y, opacity}) =>
                  <Card src={card.img} name={card.name} sub={card.sub} collapsed={collapsed} opacity={opacity} style={{
                    transform: `translate3d(${x}px,${y}px,0)`,
                    zIndex: cards.length - i
                  }} onClickCallback={() => {
                    if ('url' in card) {
                      window.open(card.url);
                    }
                  }}/>
                }
              </Motion>);
            })}
          </div>
      </div>
    );
  }

}

Gallery.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Gallery.propTypes = {
  location: React.PropTypes.object.isRequired
};

export default Gallery;
