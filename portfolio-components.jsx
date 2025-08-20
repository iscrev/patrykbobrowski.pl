// Ultra-Modern Portfolio Components
const { useState, useEffect, useRef, useCallback } = React;

// Custom Hook for Slider Control
const useSlider = (totalSlides) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goToSlide = useCallback((index) => {
        if (index >= 0 && index < totalSlides && !isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide(index);
            setTimeout(() => setIsTransitioning(false), 300);
        }
    }, [totalSlides, isTransitioning]);

    const nextSlide = useCallback(() => {
        goToSlide((currentSlide + 1) % totalSlides);
    }, [currentSlide, totalSlides, goToSlide]);

    const prevSlide = useCallback(() => {
        goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
    }, [currentSlide, totalSlides, goToSlide]);

    return {
        currentSlide,
        isPlaying,
        isTransitioning,
        setIsPlaying,
        goToSlide,
        nextSlide,
        prevSlide
    };
};

// Portfolio Header Component
const PortfolioHeader = () => {
    const [letters, setLetters] = useState([]);
    
    useEffect(() => {
        const title = "PORTFOLIO";
        const letterElements = title.split('').map((letter, index) => ({
            letter,
            delay: index * 0.1
        }));
        setLetters(letterElements);
    }, []);

    return (
        <div className="flex justify-center mb-16">
            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text">
                {letters.map((item, index) => (
                    <span
                        key={index}
                        className="inline-block animate-letter-animation"
                        style={{ animationDelay: `${item.delay}s` }}
                    >
                        {item.letter}
                    </span>
                ))}
            </h2>
        </div>
    );
};

// Video Thumbnail Component
const VideoThumbnail = ({ video, isActive, isPlaying, onClick, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div
            className={`relative group cursor-pointer transition-all duration-500 ease-out ${
                isActive ? 'scale-110 z-20' : 'scale-90 z-10'
            } ${isPlaying && !isActive ? 'blur-sm brightness-50' : ''}`}
            onClick={() => onClick(index)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glassmorphism Container */}
            <div className={`
                relative overflow-hidden rounded-3xl
                ${isActive 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/25' 
                    : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20'
                }
                ${isHovered ? 'scale-105 shadow-lg shadow-cyan-400/40' : ''}
                transition-all duration-300 ease-out
            `}>
                {/* Video Element */}
                <video
                    ref={video.ref}
                    className="w-full h-48 md:h-64 object-cover rounded-3xl"
                    preload="metadata"
                    muted
                    playsInline
                >
                    <source src={video.src} type="video/mp4" />
                </video>
                
                {/* Play Button Overlay */}
                <div className={`
                    absolute inset-0 flex items-center justify-center
                    ${isActive && isPlaying ? 'opacity-0' : 'opacity-100'}
                    transition-opacity duration-300
                `}>
                    <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center
                        ${isActive 
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50' 
                            : 'bg-white/20 backdrop-blur-sm border border-white/30'
                        }
                        ${isHovered ? 'scale-110' : ''}
                        transition-all duration-300
                    `}>
                        <i className={`fas fa-play text-white text-xl ${isActive ? 'ml-1' : ''}`}></i>
                    </div>
                </div>
                
                {/* Hover Glassmorphism Effect */}
                {isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-600/10 backdrop-blur-sm rounded-3xl"></div>
                )}
            </div>
            
            {/* Video Title */}
            <div className="mt-4 text-center">
                <h3 className="text-white font-semibold text-sm md:text-base">
                    {video.title}
                </h3>
                <p className="text-gray-300 text-xs mt-1">{video.duration}</p>
            </div>
        </div>
    );
};

// Main Video Player Component
const MainVideoPlayer = ({ video, isPlaying, onPlay, onPause }) => {
    const videoRef = useRef(null);
    
    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            onPlay();
        }
    };
    
    const handlePause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            onPause();
        }
    };
    
    return (
        <div className="relative group">
            {/* Main Video Container */}
            <div className={`
                relative overflow-hidden rounded-3xl
                ${isPlaying 
                    ? 'scale-105 shadow-2xl shadow-cyan-500/40 z-30' 
                    : 'scale-100 shadow-xl shadow-cyan-400/20'
                }
                transition-all duration-500 ease-out
            `}>
                <video
                    ref={videoRef}
                    className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-3xl"
                    preload="metadata"
                    controls
                    onPlay={handlePlay}
                    onPause={handlePause}
                >
                    <source src={video.src} type="video/mp4" />
                </video>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Video Info */}
            <div className="mt-6 text-center">
                <h3 className="text-white font-bold text-xl md:text-2xl mb-2">
                    {video.title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base">
                    {video.description}
                </p>
            </div>
        </div>
    );
};

// Animated Arrows Component
const AnimatedArrows = ({ onPrev, onNext, canGoPrev, canGoNext }) => {
    return (
        <>
            {/* Left Arrow */}
            <button
                onClick={onPrev}
                disabled={!canGoPrev}
                className={`
                    absolute left-4 top-1/2 -translate-y-1/2 z-30
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${canGoPrev 
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50 hover:scale-110' 
                        : 'bg-gray-600/50 cursor-not-allowed'
                    }
                    transition-all duration-300 ease-out
                `}
            >
                <i className="fas fa-chevron-left text-white text-lg"></i>
            </button>
            
            {/* Right Arrow */}
            <button
                onClick={onNext}
                disabled={!canGoNext}
                className={`
                    absolute right-4 top-1/2 -translate-y-1/2 z-30
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${canGoNext 
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50 hover:scale-110' 
                        : 'bg-gray-600/50 cursor-not-allowed'
                    }
                    transition-all duration-300 ease-out
                `}
            >
                <i className="fas fa-chevron-right text-white text-lg"></i>
            </button>
        </>
    );
};

// Indicator Dots Component
const IndicatorDots = ({ totalSlides, currentSlide, onDotClick }) => {
    return (
        <div className="flex justify-center space-x-3 mt-8">
            {Array.from({ length: totalSlides }, (_, index) => (
                <button
                    key={index}
                    onClick={() => onDotClick(index)}
                    className={`
                        w-3 h-3 rounded-full transition-all duration-300 ease-out
                        ${index === currentSlide 
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 scale-125 shadow-lg shadow-cyan-400/50' 
                            : 'bg-white/30 hover:bg-white/50 scale-100'
                        }
                    `}
                />
            ))}
        </div>
    );
};

// Video Slider Component
const VideoSlider = ({ videos, currentSlide, isPlaying, onSlideChange, onPlayStateChange }) => {
    const sliderRef = useRef(null);
    
    useEffect(() => {
        if (sliderRef.current) {
            const activeSlide = sliderRef.current.children[currentSlide];
            if (activeSlide) {
                activeSlide.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [currentSlide]);
    
    return (
        <div className="relative">
            <div
                ref={sliderRef}
                className="flex space-x-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {videos.map((video, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 snap-center"
                        style={{ minWidth: '300px' }}
                    >
                        <VideoThumbnail
                            video={video}
                            isActive={index === currentSlide}
                            isPlaying={isPlaying}
                            onClick={onSlideChange}
                            index={index}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Portfolio Component
const UltraModernPortfolio = () => {
    const portfolioData = [
        {
            src: 'videos/ELONMUSKNEWS.mp4',
            title: 'Elon Musk News',
            description: 'Aktualności technologiczne w formie wideo',
            duration: '2:15',
            aspect: '9:16'
        },
        {
            src: 'videos/Poraj.mp4',
            title: 'Poraj',
            description: 'Kreatywny projekt wideo w formacie 9:16',
            duration: '2:30',
            aspect: '9:16'
        },
        {
            src: 'videos/wojna-w-wietnamie.mp4',
            title: 'Wojna w Wietnamie',
            description: 'Dokument historyczny',
            duration: '8:20',
            aspect: '16:9'
        },
        {
            src: 'videos/toolfine.mp4',
            title: 'Tool Fine',
            description: 'Profesjonalny projekt wideo w formacie 9:16',
            duration: '3:15',
            aspect: '9:16'
        },
        {
            src: 'videos/edit.mp4',
            title: 'Edit',
            description: 'Profesjonalny montaż wideo',
            duration: '4:20',
            aspect: '16:9'
        },
        {
            src: 'videos/AI%20TELEDYSK.mp4',
            title: 'AI Teledysk',
            description: 'Innowacyjny teledysk stworzony przy użyciu sztucznej inteligencji',
            duration: '2:34',
            aspect: '9:16'
        },
        {
            src: 'videos/Historia.mp4',
            title: 'Historia',
            description: 'Opowieść wizualna z elementami storytellingu',
            duration: '5:30',
            aspect: '9:16'
        },
        {
            src: 'videos/Historyjka.mp4',
            title: 'Historyjka',
            description: 'Krótka historia w formie animacji',
            duration: '1:58',
            aspect: '9:16'
        },
        {
            src: 'videos/MILOSC.mp4',
            title: 'Miłość',
            description: 'Poetycki film o miłości',
            duration: '3:45',
            aspect: '9:16'
        },
        {
            src: 'videos/Motywacja.mp4',
            title: 'Motywacja',
            description: 'Inspirujący film motywacyjny',
            duration: '2:20',
            aspect: '9:16'
        },
        {
            src: 'videos/Motywacyjne.mp4',
            title: 'Motywacyjne',
            description: 'Kolekcja motywujących momentów',
            duration: '4:15',
            aspect: '9:16'
        },
        {
            src: 'videos/Pieswzruszajacy.mp4',
            title: 'Pies Wzruszający',
            description: 'Wzruszająca historia o psie',
            duration: '3:30',
            aspect: '9:16'
        },
        {
            src: 'videos/StoryTelling.mp4',
            title: 'Storytelling',
            description: 'Mistrzostwo opowiadania historii',
            duration: '6:45',
            aspect: '9:16'
        },
        {
            src: 'videos/Wybierz.mp4',
            title: 'Wybierz',
            description: 'Interaktywny film o wyborach',
            duration: '2:50',
            aspect: '9:16'
        }
    ];

    const {
        currentSlide,
        isPlaying,
        isTransitioning,
        setIsPlaying,
        goToSlide,
        nextSlide,
        prevSlide
    } = useSlider(portfolioData.length);

    const currentVideo = portfolioData[currentSlide];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-600/5"></div>
            <div className="absolute inset-0 backdrop-blur-3xl"></div>
            
            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 py-16">
                {/* Portfolio Header */}
                <PortfolioHeader />
                
                {/* Main Video Player */}
                <div className="flex justify-center mb-12">
                    <MainVideoPlayer
                        video={currentVideo}
                        isPlaying={isPlaying}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                </div>
                
                {/* Video Slider */}
                <div className="relative">
                    <VideoSlider
                        videos={portfolioData}
                        currentSlide={currentSlide}
                        isPlaying={isPlaying}
                        onSlideChange={goToSlide}
                        onPlayStateChange={setIsPlaying}
                    />
                    
                    {/* Navigation Arrows */}
                    <AnimatedArrows
                        onPrev={prevSlide}
                        onNext={nextSlide}
                        canGoPrev={currentSlide > 0}
                        canGoNext={currentSlide < portfolioData.length - 1}
                    />
                </div>
                
                {/* Indicator Dots */}
                <IndicatorDots
                    totalSlides={portfolioData.length}
                    currentSlide={currentSlide}
                    onDotClick={goToSlide}
                />
            </div>
        </div>
    );
};

// Render the portfolio
ReactDOM.render(<UltraModernPortfolio />, document.getElementById('portfolio-root')); 