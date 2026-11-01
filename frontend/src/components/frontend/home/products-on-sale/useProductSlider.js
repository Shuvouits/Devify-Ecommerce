import {
    useEffect,
    useRef,
    useState,
} from "react";

const useProductSlider = (
    products = []
) => {
    const sliderRef =
        useRef(null);

    const [visibleCount, setVisibleCount] =
        useState(4);

    const [
        canScrollLeft,
        setCanScrollLeft,
    ] = useState(false);

    const [
        canScrollRight,
        setCanScrollRight,
    ] = useState(false);

    useEffect(() => {
        const updateVisibleCount =
            () => {
                const width =
                    window.innerWidth;

                if (width < 640) {
                    setVisibleCount(
                        2
                    );

                    return;
                }

                if (
                    width < 1024
                ) {
                    setVisibleCount(
                        3
                    );

                    return;
                }

                setVisibleCount(
                    4
                );
            };

        updateVisibleCount();

        window.addEventListener(
            "resize",
            updateVisibleCount
        );

        return () => {
            window.removeEventListener(
                "resize",
                updateVisibleCount
            );
        };
    }, []);

    useEffect(() => {
        const timer =
            setTimeout(() => {
                updateScrollState();
            }, 50);

        return () =>
            clearTimeout(
                timer
            );
    }, [
        products,
        visibleCount,
    ]);

    const updateScrollState =
        () => {
            const slider =
                sliderRef.current;

            if (!slider) {
                return;
            }

            const maxScroll =
                slider.scrollWidth -
                slider.clientWidth;

            setCanScrollLeft(
                slider.scrollLeft >
                    5
            );

            setCanScrollRight(
                slider.scrollLeft <
                    maxScroll - 5
            );
        };

    const scrollSlider = (
        direction
    ) => {
        const slider =
            sliderRef.current;

        if (!slider) {
            return;
        }

        const distance =
            slider.clientWidth;

        slider.scrollBy({
            left:
                direction ===
                "next"
                    ? distance
                    : -distance,

            behavior:
                "smooth",
        });
    };

    const scrollPrevious =
        () => {
            scrollSlider(
                "previous"
            );
        };

    const scrollNext = () => {
        scrollSlider(
            "next"
        );
    };

    return {
        sliderRef,
        visibleCount,
        canScrollLeft,
        canScrollRight,
        updateScrollState,
        scrollPrevious,
        scrollNext,
    };
};

export default useProductSlider;