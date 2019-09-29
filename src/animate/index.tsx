import React, { CSSProperties } from 'react';
import { Tween } from './Tween/Tween';
interface IState {style: CSSProperties}
export class Animate extends React.Component<any, IState> {
  state:IState = {
    style: {}
  }
  componentDidMount() {
    const tween = new Tween({
      duration: 2,
      type: 'bezier',
      styles: [
        {
          x: 0,
          y: 0,
          rotate: 0,
          per: 0
        },
        {
          x: 100,
          y: 100,
          per: 0.25
        },
        {
          x: 200,
          y: 0,
          per:0.5
        },
        {
          x: 100,
          y: -100,
          per: 0.75
        },
        {
          x: 0,
          y: 0,
          per: 1
        },
      ]
    });
    tween.on('onChange', (style)=> {
      this.setState({
        style: {
          transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotate}deg)`,
          display: 'inline-block',
          transformOrigin: 'center'
          // transition: 'all',
        }
      })
    })
    tween.run()
   }

  render() {
    return (
     <div style={{height: '100vh', width: '100vw', background: '#fff',padding: 300 }}>
        <div style={this.state.style}>
          <div style={{width: 40, height: 40, background: '#f60'}}>艾哈</div>
        </div>
     </div>
    );
  }
}
