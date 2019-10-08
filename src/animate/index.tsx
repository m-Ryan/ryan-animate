import React, { CSSProperties } from 'react';
// import { Tween } from './Tween/Tween';
import { Bezier } from './Tween/Bezier';
const tween = new Bezier({
  reverseable: true,
  infinite: true,
  group: [
    {
      points: [
        {
          x: 200,
          y: -200
        },
        {
          x: 400,
          y: 0,
        },
        {
          x: 600,
          y: -200,
        },
      ],
      duration: 5
    },
    {
      points: [
        {
          x: 600,
          y: -200,
        },
        {
          x: 800,
          y: 0,
        },
        {
          x: 1000,
          y: -200,
        }
      ],
      duration: 5
    }
  ]
});

interface IState {style: CSSProperties, isPlay: boolean}
export class Animate extends React.Component<any, IState> {
  state:IState = {
    style: {},
    isPlay: false
  }

  componentDidMount() {
    tween.on('onChange', (style)=> {
      // console.log('style', style)
      this.setState({
        style: {
          transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotate}deg)`,
          display: 'inline-block',
          transformOrigin: 'center'
          // transition: 'all',
        }
      })
    })
    this.playAnimate();
   }

   playAnimate = ()=> {
     if (!this.state.isPlay) {
       this.setState({
         isPlay: !this.state.isPlay
       }, ()=> {
         console.log('run')
        tween.run()
       })
      
     } else {
      this.setState({
        isPlay: !this.state.isPlay
      }, ()=> {
        tween.stop()
      })
     }
   }

  render() {
    return (
     <div style={{height: '100vh', width: '100vw', background: '#fff',padding: 400 }} onClick={this.playAnimate}>
        <div style={this.state.style}>
          <div style={{
            // backgroundImage: `url(http://assets.maocanhua.cn/FuiCg21TBgG6uSh0gNBmdUYUE_en)`,
            backgroundColor: 'yellow',
            backgroundSize: '100% 100%',
            width: 20,
            height: 20
          }}>555</div>
        </div>
     </div>
    );
  }
}
