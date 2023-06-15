import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Download from 'yet-another-react-lightbox/plugins/download';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
// import Video from "yet-another-react-lightbox/plugins/video";
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import './ReactLightBox.scss';
import { useDispatch } from 'react-redux';
import { useComponentSelector } from '~/component/redux/selector';
import { componentSlice } from '~/component/redux/slices';
const ReactLightBox = () => {
    const { viewFileModal } = useComponentSelector();
    const dispatch = useDispatch();
    const [slides, setSlides] = React.useState([]);
    const [index, setIndex] = React.useState({
        prevIndex: 0,
        nextIndex: 0,
    });

    const closeZoomBox = () => {
        dispatch(
            componentSlice.actions.setViewFileModal({
                zoomFile: false,
                enable: true,
            })
        );
    };

    React.useEffect(() => {
        const filterImages = viewFileModal.files.filter(
            (file) => file.type === 'image'
        );
        setSlides(filterImages.map((file) => ({ src: file.link })));
    }, [viewFileModal.files]);

    return (
        <Lightbox
            open={viewFileModal.zoomFile}
            slides={slides}
            plugins={[
                Zoom,
                Thumbnails,
                Counter,
                Fullscreen,
                Download,
                Slideshow,
            ]}
            close={closeZoomBox}
            counter={{ container: { style: { top: 0 } } }}
            className="react-lightbox"
            index={viewFileModal.currentIndex}
        />
    );
};

export default ReactLightBox;
