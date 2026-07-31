gsap.registerPlugin(ScrollTrigger);

let tl1 = gsap.timeline({
scrollTrigger:{
trigger: ".container",
start: "top top",
end: "+=" + 1 * window.innerHeight + "px",
scrub: 1,
pin: true,
}
});

tl1.to(".container",{
scale: 2.5,
duration: 1,
ease: "none",
});

tl1.to(".mockup", {
opacity: 0,
filter: "blur(20px)",
duration: 1,
ease: "none",
});

tl1.to(".container",{
filter: "blur(20px)",
opacity: 0.1,
ease: "none",
});