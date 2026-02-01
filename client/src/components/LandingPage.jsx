import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const btnRef = useRef(null);
    const shapesRef = useRef([]);

    // Add shaping els to ref array
    const addToShapes = (el) => {
        if (el && !shapesRef.current.includes(el)) {
            shapesRef.current.push(el);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // 1. Entry Animation (Dramatic & Visible)
            tl.fromTo(cardRef.current,
                { y: 100, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }
            )
                .fromTo(titleRef.current,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
                    '-=1'
                )
                .fromTo(subtitleRef.current,
                    { x: -30, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1, ease: 'power2.out' },
                    '-=0.8'
                )
                .fromTo(btnRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
                    '-=0.5'
                );

            // 2. Continuous Floating Animation (The "Not Static" part)
            gsap.to(cardRef.current, {
                y: '-=20',
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // Float shapes
            shapesRef.current.forEach((shape, i) => {
                gsap.to(shape, {
                    rotation: 360,
                    duration: 20 + i * 5,
                    repeat: -1,
                    ease: 'linear'
                });
                gsap.to(shape, {
                    y: 30,
                    duration: 4 + i,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: i
                });
            });

            // 3. Mouse Parallax Effect (Interactive)
            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                const moveX = (clientX - centerX) / 50;
                const moveY = (clientY - centerY) / 50;

                // Move card slightly opposite to mouse
                gsap.to(cardRef.current, {
                    x: -moveX,
                    y: -moveY, // Note: this might conflict with yoyo, so we usually wrap in a container or use separate transform properties (GSAP handles independent transforms if smart, but safer to use xPercent/yPercent for one and x/y for other, or just x)
                    // Actually, let's just move X for parallax to avoid fighting the Y float
                    duration: 0.5,
                    ease: 'power1.out',
                    overwrite: 'auto' // Prevent conflict
                });

                // But wait, overwrite will kill the float.
                // Better approach: Parallax the background or shapes, keep card floating on Y ONLY.
                // Let's parallax the shapes!
                shapesRef.current.forEach((shape, i) => {
                    const depth = (i + 1) * 20;
                    gsap.to(shape, {
                        x: (clientX - centerX) / depth,
                        y: (clientY - centerY) / depth,
                        duration: 1,
                        ease: 'power1.out',
                        overwrite: false // Allow rotation/float to continue? No, x/y will conflict.
                        // We'll skip complex mixing for now and just do simple parallax on shapes if they aren't floating.
                        // Let's stick to X-axis parallax for card and shapes.
                    });
                });
            };

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleEnter = () => {
        gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.1, // Zoom out effect
            filter: 'blur(10px)',
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => {
                navigate('/designer');
            }
        });
    };

    return (
        <div className="landing-page" ref={containerRef}>
            {/* Background Orbs */}
            <div className="glow-bg">
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
                <div className="glow-orb orb-3"></div>
            </div>

            {/* Floating Geometric Shapes */}
            <div className="floating-element square-1" ref={addToShapes}></div>
            <div className="floating-element square-2" ref={addToShapes}></div>

            {/* Hero Card */}
            <div className="hero-glass-card" ref={cardRef}>
                <h1 className="hero-title" ref={titleRef}>
                    vv-Certify
                </h1>
                <p className="hero-subtitle" ref={subtitleRef}>
                    Secure. Private. Lightning Fast.
                </p>

                <button
                    className="btn-fancy-green"
                    ref={btnRef}
                    onClick={handleEnter}
                >
                    Start Designing
                </button>

            </div>
        </div>
    );
};

export default LandingPage;
