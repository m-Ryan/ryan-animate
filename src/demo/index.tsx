import React from 'react';
import styles from './index.module.scss';
import { AnimateItem } from './bezier';
import { Bezier } from '../util/animate/Bezier';
import { Tween } from 'util/animate/Tween';
import { SvgPath } from 'util/animate/SvgPath';

export class Demo extends React.Component {

  render() {
    return (
      <div className={styles.container}>
        <h2>Bezier demo</h2>
        <div className={styles.list}>
          <div className={styles.listItem}>
            {/* 1 */}
            <AnimateItem plugin={
              new Bezier({
                reverseable: true,
                infinite: true,
                autoRotate: true,
                group: [
                  {
                    points: [
                      {
                        x: 0,
                        y: 0
                      },
                      {
                        x: 40,
                        y: 386
                      },
                      {
                        x: 200,
                        y: -290,
                      },
                      {
                        x: 200,
                        y: 200
                      }
                    ],
                    duration: 3
                  }
                ]
              })
            }
              onChange={
                (style) => ({
                  transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotate}deg)`,
                  display: 'inline-block',
                  transformOrigin: 'center',
                })
              }
            />
          </div>

          {/* 2 */}
          <div className={styles.listItem}>
            <AnimateItem plugin={
              new Bezier({
                infinite: true,
                group: [
                  {
                    points: [
                      {
                        x: 0,
                        y: 0
                      },
                      {
                        x: 34,
                        y: 194
                      },
                      {
                        x: 32,
                        y: 8
                      },
                      {
                        x: 200,
                        y: 200
                      }
                    ],
                    duration: 3
                  }
                ]
              })
            }
              onChange={
                (style) => ({
                  transform: `translate(${style.x}px, ${style.y}px)`,
                  display: 'inline-block',
                  transformOrigin: 'center',
                })
              }
            />
          </div>

          {/* 3 */}
          <div className={styles.listItem}>
            <AnimateItem plugin={
              new Bezier({
                infinite: true,
                reverseable: true,
                group: [
                  {
                    points: [
                      {
                        x: 0,
                        y: 0
                      },
                      {
                        x: 34,
                        y: 8
                      },
                      {
                        x: 158,
                        y: 22
                      },
                      {
                        x: 200,
                        y: 200
                      }
                    ],
                    duration: 3
                  }
                ]
              })
            }
              onChange={
                (style) => ({
                  transform: `translate(${style.x}px, ${style.y}px)`,
                  display: 'inline-block',
                  transformOrigin: 'center',
                })
              }
            />
          </div>

          {/* 4 */}
          <div className={styles.listItem}>
            <AnimateItem plugin={
              new Bezier({
                infinite: true,
                autoRotate: true,
                group: [
                  {
                    points: [
                      {
                        x: 0,
                        y: 0
                      },
                      {
                        x: 100,
                        y: 0
                      },
                      {
                        x: 100,
                        y: 100
                      },
                      {
                        x: 0,
                        y: 100
                      },
                    ],
                    duration: 1
                  },
                  {
                    points: [
                      {
                        x: 0,
                        y: 100
                      },
                      {
                        x: -100,
                        y: 100
                      },
                      {
                        x: -100,
                        y: 0
                      },
                      {
                        x: 0,
                        y: 0
                      },
                    ],
                    duration: 1
                  }
                ]
              })
            }
              onChange={
                (style) => {
                  return {
                    transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotate}deg)`,
                    display: 'inline-block',
                    marginTop: 50,
                    marginLeft: 100,
                    transformOrigin: 'center',
                  }
                }
              }
            />
          </div>


        </div>

        <h2>Tween demo</h2>
        <div className={styles.list}>
          <div className={styles.listItem}>
            {/* 1 */}
            <AnimateItem plugin={
              new Tween({
                reverseable: true,
                infinite: true,
                autoRotate: true,
                type: 'easeInOutBack',
                group: [
                  {
                    points: [
                      {
                        x: 0,
                        y: 0
                      },
                      {
                        x: 200,
                        y: 200
                      }
                    ],
                    duration: 3
                  }
                ]
              })
            }
              onChange={
                (style) => ({
                  transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotate}deg)`,
                  display: 'inline-block',
                  transformOrigin: 'center',
                })
              }
            />
          </div>

          {/* 2 */}
          <div className={styles.listItem}>
            <AnimateItem plugin={
              new Tween({
                type: 'linear',
                infinite: true,
                group: [
                  {
                    points: [
                      {
                        opacity: 1
                      },
                      {
                        opacity: 0.5
                      },
                      {
                        opacity: 1
                      },
                    ],
                    duration: 3
                  }
                ]
              })
            }
              onChange={
                (style) => ({
                  display: 'inline-block',
                  opacity: style.opacity,
                  width: '100%',
                  height: '100%'
                })
              }
            />
          </div>

          {/* 3 */}
          <div className={styles.listItem}>
            <AnimateItem plugin={
              new Tween({
                type: 'easeInBounce',
                infinite: true,
                group: [
                  {
                    points: [
                      {
                        scale: 1
                      },
                      {
                        scale: 0.7
                      },
                      {
                        scale: 0.5
                      },
                      {
                        scale: 0.3
                      },
                      {
                        scale: 0.1
                      }
                    ],
                    duration: 5
                  }
                ]
              })
            }
              onChange={
                (style) => ({
                  transform: `scale(${style.scale})`,
                  display: 'inline-block',
                  transformOrigin: 'center',
                  width: '100%',
                  height: '100%'
                })
              }
            />
          </div>

          {/* 4 */}
          <div className={styles.listItem}>
            <AnimateItem plugin={
              new Tween({
                type: 'easeInOutCubic',
                infinite: true,
                group: [
                  {
                    points: [
                      {
                        x: 0,
                        y: 0
                      },
                      {
                        x: 100,
                        y: 100
                      }
                    ],
                    duration: 1.5
                  },
                  {
                    points: [
                      {
                        x: 100,
                        y: 100
                      },
                      {
                        x: 200,
                        y: 100
                      }
                    ],
                    duration: 1.5
                  }
                ]
              })
            }
              onChange={
                (style) => ({
                  transform: `translate(${style.x}px, ${style.y}px)`,
                  display: 'inline-block',
                  transformOrigin: 'center',
                })
              }
            />
          </div>

        </div>
        <h2>SvgPath demo</h2>
        <div className={styles.list}>

          <div className={styles.listItem}>
            {/* 1 */}
            <AnimateItem plugin={
              SvgPath({
                // reverseable: true,
                infinite: true,
                autoRotate: true,
                path: 'M 0 100 Q 0 0 100 0 Q 200 0 200 100 Q 200 200 100 200 Q 0 200 0 100 ',
                duration: 5
              })
            }
              onChange={
                (style) => {
                  return {
                    transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotate}deg)`,
                    display: 'inline-block',
                    transformOrigin: 'center',
                  }
                }
              }
            />
          </div>

          <div className={styles.listItem}>
            {/* 1 */}
            <AnimateItem plugin={
              SvgPath({
                // reverseable: true,
                infinite: true,
                autoRotate: true,
                path: 'M 0 0 Q 154 33 198 198 ',
                duration: 3
              })
            }
              onChange={
                (style) => {
                  return {
                    transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotate}deg)`,
                    display: 'inline-block',
                    transformOrigin: 'center',
                  }
                }
              }
            />
          </div>

          <div className={styles.listItem}>
            {/* 1 */}
            <AnimateItem plugin={
              SvgPath({
                // reverseable: true,
                infinite: true,
                autoRotate: true,
                path: 'M 0 55 Q 66 110 88 198 Q 110 110 154 198 Q 176 154 198 198 ',
                duration: 3
              })
            }
              onChange={
                (style) => {
                  return {
                    transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotate}deg)`,
                    display: 'inline-block',
                    transformOrigin: 'center',
                  }
                }
              }
            />
          </div>

          <div className={styles.listItem}>
            {/* 1 */}
            <AnimateItem plugin={
              SvgPath({
                // reverseable: true,
                infinite: true,
                autoRotate: true,
                path: 'M 100 100 Q 44 99 44 154 Q 99 198 165 176 Q 198 132 176 77 Q 110 0 22 66 ',
                duration: 3
              })
            }
              onChange={
                (style) => {
                  return {
                    transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotate}deg)`,
                    display: 'inline-block',
                    transformOrigin: 'center',
                  }
                }
              }
            />
          </div>


        </div>

      </div>
    );
  }
}
