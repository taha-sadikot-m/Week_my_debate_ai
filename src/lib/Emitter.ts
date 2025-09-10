import _ from 'lodash';

class Emitter {
  private events: { [key: string]: Function[] } = {};

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach((fn) => fn(...args));
    }
    return this;
  }

  on(event: string, fn: Function) {
    if (this.events[event]) this.events[event].push(fn);
    else this.events[event] = [fn];
    return this;
  }

  off(event: string, fn?: Function) {
    if (event && _.isFunction(fn)) {
      const listeners = this.events[event];
      if (!listeners) return this;
      const index = listeners.findIndex((_fn) => _fn === fn);
      if (index !== -1) listeners.splice(index, 1);
    } else if (event) {
      this.events[event] = [];
    }
    return this;
  }
}

export default Emitter; 