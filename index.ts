import { fromEvent,interval,Observable } from 'rxjs'; 
import { map,filter,flatMap,takeUntil } from 'rxjs/operators';

function asteroids() {
    const ship = document.getElementById("ship")!;
    const state = {
        x:75,y:75,angle:0
    }
    fromEvent<KeyboardEvent>(document,'keydown')
      .pipe(
        filter(({repeat})=>!repeat),
        filter(({keyCode:k})=>k===37 || k===39),
        flatMap(({keyCode:downKeyCode})=>interval(10).pipe(
          takeUntil(
            fromEvent<KeyboardEvent>(document,'keyup').pipe(
              filter(up=>up.keyCode === downKeyCode))),
          map(_=>downKeyCode===37?-1:1))
        )
      ).subscribe({next:e=>{
        ship.setAttribute('transform',
          `translate(${state.x},${state.y}) rotate(${state.angle+=e})`)
      }})
}

function asteroidsEvents() {
    const ship = document.getElementById("ship")!;
    const state = {
        x:75,y:75,angle:0
    }
    document.onkeydown = e=>{
      if((e.keyCode === 37 || e.keyCode === 39) && !e.repeat) {
        const handle = setInterval(i=>{
        ship.setAttribute('transform',
          `translate(${state.x},${state.y}) rotate(${state.angle+=e.keyCode === 37 ? -1 : 1})`)
        },10)
        document.onkeyup = u=>{
          if(u.keyCode === e.keyCode) {
            clearInterval(handle);
          }
        }
      }
    }
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