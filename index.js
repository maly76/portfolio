class el {
  constructor (tagName, classList) {
    this.el = document.createElement(tagName);
    if (classList instanceof Array) {
      classList.forEach (cl => this.el.classList.add(cl));
    } else {
      this.el.setAttribute('class', classList);
    }
  }

  setText(text) {
    this.el.innerHTML = text;
    return this;
  }

  setTooltip (tooltip) {
    this.el.setAttribute('tooltip', tooltip);
    return this;
  }

  children() {
    Array.prototype.slice.call(arguments).forEach(arg => {
      if (arg instanceof el) {
        this.el.appendChild(arg.html());
      } else if ('string' == typeof arg) {
        this.el.appendChild(document.createTextNode(arg));
      } else {
        this.el.appendChild(arg);
      }
    });
    return this;
  }

  html() {
    return this.el;
  }
  
  css(key, val) {
    this.el.style[key] = val;
    return this;
  }
}

class Tooltip {
  constructor (text) {
    this.text = text;
    this.el = new el('div', 'tooltiptext');
    this.el.setText(text);
    this.isHidden = true;
  }

  show(x, y) {
    this.isHidden = false;
    this.el.css('left', x + 'px');
    this.el.css('top', y + 'px');
    document.body.appendChild(this.el.html());
  }

  hide () {
    this.isHidden = true;
    document.body.removeChild(this.el.html());
  }

  isVisible() {
    return !this.isHidden;
  }
}

class ProgressWrapper {
  constructor (caption, value) {
    this.caption = caption;
    this.value = value;
  }

  getValue () {
    return this.value + '%';
  }

  build () {
    var wrapperEl = new el('div', 'progress-wrapper');
    var captionEl = new el('span', 'progress-caption');
    captionEl.setText(this.caption);
    var progressEl = new el('div', 'progress');
    var barEl = new el('div', 'progress-bar');
    barEl.setText(this.getValue());
    barEl.css('width', this.getValue());

    progressEl.children(barEl);
    wrapperEl.children(captionEl);
    wrapperEl.children(progressEl);
    return wrapperEl;
  }
}

class SkillsWrapper {
  constructor (title, items) {
    this.title = title;
    this.items = items;
  }

  build () {
    var columnEl = new el('div', 'column');
    var titleEl = new el('div', 'section-title');
    titleEl.setText(this.title);
    columnEl.children(titleEl);
    this.items.map (item => {
      const el = item.build();
      columnEl.children(el);
    });
    return columnEl;
  }
}

class TimelinePoint {
  constructor (title, detail) {
    this.title = title;
    this.detail = detail;
    this.tooltip = null;
  }

  build(isFirst = false) {
    this.isFirst = isFirst;
    var cardEl = new el('div', 'card');
    if (this.tooltip) {
      console.log(this.tooltip)
      cardEl.setTooltip(this.tooltip);
    }
    var infoEl = new el('div', 'info');
    var titleEl = new el('h3', ('title' + (this.isFirst ? ' first' : ''))).setText(this.title);
    var detailEl = new el('p').setText(this.detail);
    infoEl.children(titleEl, detailEl);
    cardEl.children(infoEl);
    return cardEl;
  }

  setTooltip (tooltip) {
    this.tooltip = tooltip;
    return this;
  }
}

class Timeline {
  constructor (title, items) {
    this.title = title;
    this.items = items;
  }

  build () {
    var columnEl = new el('div', 'column');
    var timelineEl = new el('div', 'timeline')
                    .children(
                      new el('div', 'timeline-title').setText(this.title)
                    );
    var outerEl = new el('div', 'outer');
    
    this.items.map ((item, index) => {
      const el = item.build(index == 0);
      outerEl.children(el);
    });

    timelineEl.children(outerEl);
    columnEl.children(timelineEl);
    return columnEl;
  }
}

const skills = [
  new SkillsWrapper('Programing Languages', [
    new ProgressWrapper('C', 95),
    new ProgressWrapper('C++', 95),
    new ProgressWrapper('C#', 95),
    new ProgressWrapper('Javascript', 90),
    new ProgressWrapper('Typescript', 80),
    new ProgressWrapper('Kotlin', 95),
    new ProgressWrapper('Java', 95),
    new ProgressWrapper('Rust', 90),
    new ProgressWrapper('SQL', 90),
  ]),
  new SkillsWrapper('Frameworks', [
    new ProgressWrapper('Qt', 95),
    new ProgressWrapper('Angular', 90),
    new ProgressWrapper('nodejs', 80),
    new ProgressWrapper('Ruby on Rails', 80),
  ]),
  new SkillsWrapper('Languages', [
    new ProgressWrapper('German', 95),
    new ProgressWrapper('English', 90),
    new ProgressWrapper('Arabic', 80),
  ]),
];

const timelines = [
  new Timeline('Education', [
    new TimelinePoint('2019 - 2022', 'Bachelor of Science (Computer Science at the THM in Germany-Gießen)')
    .setTooltip('In German it calls Fachabitur, it is a certificate entitling students to study at a University of Applied Sciences'),
    new TimelinePoint('2017 - 2019', 'vocational diploma (business informatics)'),
    new TimelinePoint('2016', 'Language course with B1-Certificate in German'),
    new TimelinePoint('2004 - 2015', 'School (Grade 11)'),
  ]),
  new Timeline('Career', [
    new TimelinePoint('2022 - Today', 'Software developer (Prisma GmbH in Weilburg)'),
    new TimelinePoint('2017 - 2018', 'Accompanied internship to acquire the vocational diploma at Landau Software GmbH (Bad Wildungen)'),
    new TimelinePoint('2016', '3 month internship in a hospital (Korbach) as nurse'),
  ]),
];

var skillsSection = document.getElementById('skillsSection');
var careerSection = document.getElementById('careerSection');
var sections = document.querySelectorAll('section');
var navLinks = document.querySelectorAll('header nav a');
var header = document.querySelector('header');

header.classList.toggle('sticky', window.screenY > 100);
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
});

function initTooltips () {
  document.querySelectorAll('[tooltip]').forEach((el, idx) => {
    const tooltip = el.attributes['tooltip'].value;
    const tooltipEl = new Tooltip(tooltip);
    el.tooltipEl = tooltipEl;
    el.classList.add('tooltip');
    el.appendChild(tooltipEl.el.html());
    // const parentRect = el.getBoundingClientRect();
    // el.addEventListener('mouseenter', (e) => {
    //   if (!el.tooltipEl.isVisible()) {
    //     el.tooltipEl.show(parentRect.left, parentRect.top + parentRect.height + 5);
    //   }
    // });

    // el.addEventListener('mouseleave', (e) => {
    //   if (el.tooltipEl.isVisible()) {
    //     el.tooltipEl.hide();
    //   }
    // });
  });
}

function init () {
  skills.map (skill => {
    const skillEl = skill.build();
    skillsSection.appendChild(skillEl.html());
  });

  timelines.map (time => {
    const timeEl = time.build();
    careerSection.appendChild(timeEl.html());
  });

  window.onscroll = () => {
    sections.forEach(sec => {
      let top = window.scrollY;
      let offset = sec.offsetTop - 150;
      let height = sec.offsetHeight;
      let id = sec.getAttribute('id');
      if (id)
      if (top >= offset && top < offset + height) {
        navLinks.forEach(links => {
          links.classList.remove('active');
          document.querySelector('header nav a[href*='+id+']').classList.add('active');
        });
      }
    });

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
    initTooltips();
  }
}

init();