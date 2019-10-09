import React from 'react';
import styles from './index.module.scss';
import { AnimateItem } from './bezier';
import { Bezier } from '../util/Tween/Bezier';
import { Tween } from 'util/Tween/Tween';

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
                type: 'easeInOutCirc',
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
                      {
                        x: 0,
                        y: 0
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
              new Tween({
                type: 'easeInOutBounce',
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
              new Tween({
                type: 'easeInSine',
                infinite: true,
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
                  transform: `translate(${style.x}px, ${style.y}px)`,
                  display: 'inline-block',
                  transformOrigin: 'center',
                })
              }
            />
          </div>


        </div>
      </div>
    );
  }
}
