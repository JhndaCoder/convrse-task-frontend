import { useEffect, useRef } from 'react';
import * as PANOLENS from 'panolens';

const VRView = ({ panoramaImage }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const viewer = new PANOLENS.Viewer({
            container: containerRef.current,
            autoRotate: true,
            autoRotateSpeed: 1,
        });

        const panorama = new PANOLENS.ImagePanorama(panoramaImage);
        viewer.add(panorama);

        return () => {
            viewer.dispose();
        };
    }, [panoramaImage]);

    return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
};

export default VRView;
