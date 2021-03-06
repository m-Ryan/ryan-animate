import React, { CSSProperties } from 'react';
import styles from './index.module.scss';
import { Bezier } from '../../util/animate/Bezier';
import { IBaseStyle } from '../../util/animate/type';
import { Tween } from '../../util/animate/Tween';


interface IProps {
  onChange: (style: IBaseStyle)=> CSSProperties;
  plugin: Bezier| Tween
}
interface IState { style: CSSProperties }

export class AnimateItem extends React.Component<IProps, IState> {
  state: IState = {
    style: {}
  }

  componentDidMount() {
    const plugin = this.props.plugin
    plugin.on('onChange', (style) => {

      this.setState({
        style: this.props.onChange(style)
      })
    })
    plugin.run();
  }

  render() {
    return (
      <div style={this.state.style} className={styles.ball}>{this.state.style.width}</div>
    );
  }
}

