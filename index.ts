import { fromEvent,interval,Observable } from 'rxjs'; 
import { map,filter,flatMap,takeUntil } from 'rxjs/operators';

function asteroids() {
    const ship = document.getElementById("ship")!;
    const state = {
        x:50,y:50,angle:0
    }
    fromEvent<KeyboardEvent>(document,'keydown')
      .pipe(
        filter(keyEvent=>!keyEvent.repeat),
        flatMap(({keyCode:downKeyCode})=>interval(10).pipe(
          takeUntil(fromEvent<KeyboardEvent>(document,'keyup').pipe(
            filter(up=>up.keyCode === downKeyCode))),
            map(_=>({
                left:downKeyCode===37,
                up:downKeyCode===38,
                right:downKeyCode===39
            }))
        )),
        filter(e=>e.left || e.right),
        map(e=>({angle:e.left?-1:1}))
      ).subscribe({next:e=>{
        ship.setAttribute('transform',
          `translate(${state.x},${state.y}) rotate(${state.angle+=e.angle})`)
      }})
}

setTimeout(asteroids, 0)
//window.onload = asteroids

function showKeys() {
  function showKey(elementId,keyCode) {
    fromEvent<KeyboardEvent>(document,'keydown')
      .pipe(filter(e=>e.keyCode === keyCode))
      .subscribe(e=>{
        const arrowKey = document.getElementById(elementId)!;
        arrowKey.classList.add("highlight");
      })
    fromEvent<KeyboardEvent>(document,'keyup')
      .pipe(filter(e=>e.keyCode === keyCode))
      .subscribe(e=>{
        const arrowKey = document.getElementById(elementId)!;
        arrowKey.classList.remove("highlight");
      })
  }
  showKey("leftarrow",37);
  showKey("rightarrow",39);
}

setTimeout(showKeys, 0)