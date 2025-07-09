const fitur1 = document.querySelector('.fitur-1');
const fitur2 = document.querySelector('.fitur-2');
const h2Fitur = document.querySelector('h2');

console.log(fitur1)
console.log(fitur2)

const observerOptions = {
    root: null,
    rootMargin : '0px',
    threshold: 0.5
};


const observer = new IntersectionObserver((entries, observer)=> {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

observer.observe(fitur1);
observer.observe(fitur2);
observer.observe(h2Fitur);

