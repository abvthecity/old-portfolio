import React, { Component } from 'React';
import { TransitionMotion, spring, presets } from 'react-motion';

import CardStack from '../components/CardStack';
import Card from '../components/Card';

class Landing extends Component {

  constructor(props) {
    super(props);

    this.state = {
      stacks: [],
      target: null,
      targetIndex: -1,
      numberOfCards: 0
    };
  }

  componentDidMount() {
    this.setState({
      stacks: [
        {
          name: 'Code',
          sub: '3 projects',
          cards: ['molly.jpg', 'ballotview.jpg', 'hackschedule.jpg']
        },
        {
          name: 'Design',
          sub: '3 projects',
          cards: ['hacksc.jpg', 'lostintheworld.jpg', 'cometogether.jpg']
        },
        {
          name: 'Photo',
          sub: '2 projects',
          cards: ['vsco.jpg', 'china.jpg']
        }
      ],
    });
  }

  render() {
    const { stacks, target } = this.state;
    return (
      <div id='landing'>
        <div className='logo'>Andrew Jiang</div>
        <nav>
          <a href={'https://drive.google.com/file/d/0B8yzs98xLPTPR3JvY0JPSEhEYkk/view'}>Resume</a>
          <a href={'http://github.com/ninjiangstar'}>Github</a>
          <a href={'mailto:andrewji@usc.edu'}>Email</a>
        </nav>
        <TransitionMotion
          willEnter={() => ({opacity: 0, transition: 0 })}
          willLeave={() => ({opacity: spring(0), transition: spring(0) })}
          didLeave={() => {
            this.context.router.push({
              pathname: '/' + target.toLowerCase(),
              state: {
                goBackCardsPerRow: this.state.numberOfCards,
                goBackIndex: this.state.targetIndex
              }
            });
          }}
          defaultStyles={stacks.map((stack, i) => ({
            key: stack.name,
            data: stack,
            style: { opacity: 0, transition: 0 }
          }))}
          styles={stacks.map((stack, i) => ({
            key: stack.name,
            data: stack,
            style: { opacity: (this.props.location.state && this.props.location.state.goBackIndex == i) ? 1 : spring(1), transition: spring(1) }
          }))}>
          {interpolatedStyles =>
            <div className='cards-container'>
              {interpolatedStyles.map((c, i) =>
                <CardStack key={c.key}
                  cards={c.data.cards}
                  name={c.data.name}
                  sub={c.data.sub}
                  transition={c.style.transition}
                  opacity={(c.key == target) ? 1 : c.style.opacity}
                  onClickCallback={() => {
                    this.setState({ stacks: [], target: c.key, targetIndex: i, numberOfCards: interpolatedStyles.length });
                  }}/>
              )}
            </div>
          }
        </TransitionMotion>
      </div>
    )
  }

}

Landing.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Landing.propTypes = {
  location: React.PropTypes.object.isRequired
};

export default Landing;
