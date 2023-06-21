export class ProgressWrapper {
    constructor (caption, value) {
      this.caption = caption;
      this.value = value;
    }
  
    getValue () {
      return this.value + '%';
    }
  
    build () {
      var wrapperEl = document.createElement('div');
      wrapperEl.setAttribute('class', 'progress-wrapper');
      var captionEl = document.createElement('span');
      captionEl.setAttribute('class', 'progress-caption');
      captionEl.innerHTML = this.caption;
      var progressEl = document.createElement('div');
      progressEl.setAttribute('class', 'progress');
      var barEl = document.createElement('div');
      barEl.setAttribute('class', 'progress-bar');
      barEl.innerHTML = this.getValue();
      barEl.style.width = this.getValue();
  
      progressEl.appendChild(barEl);
      wrapperEl.appendChild(captionEl);
      wrapperEl.appendChild(progressEl);
      return wrapperEl;
    }
}
  
export class CareerSection {
    constructor (title, items) {
      this.title = title;
      this.items = items;
    }
  
    build () {
      var columnEl = document.createElement('div');
      columnEl.setAttribute('class', 'column');
      var titleEl = document.createElement('span');
      titleEl.setAttribute('class', 'section-title');
      titleEl.innerHTML = this.title;
      columnEl.appendChild(titleEl);
      this.items.map (item => {
        const el = item.build();
        columnEl.appendChild(el);
      });
      return columnEl;
    }
}
