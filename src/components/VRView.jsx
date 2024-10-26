import { useEffect, useRef } from 'react';
import * as PANOLENS from 'panolens';

const VRView = ({ panoramaImage }) => {
    const containerRef = useRef(null);
    const viewerRef = useRef(null);
    useEffect(() => {
        if (!viewerRef.current) {
            const viewer = new PANOLENS.Viewer({
                container: containerRef.current,
                autoRotate: true,
                autoRotateSpeed: 1,
            });

            const panorama = new PANOLENS.ImagePanorama(panoramaImage);
            viewer.add(panorama);

            viewerRef.current = viewer;
        }

        return () => {
            if (viewerRef.current) {
                viewerRef.current.dispose();
                viewerRef.current = null;
            }
        };
    }, [panoramaImage]);

    return <div ref={containerRef} className='test' style={{ width: '33vw', height: '200px' }} />;
};

export default VRView;
