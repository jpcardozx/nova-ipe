/**
 * Visual Quality Test for Hero Background
 * This script adds visual debugging tools to check image rendering quality
 */

// Add visual quality indicators to the hero section
function addQualityIndicators() {
    // Wait for the component to mount
    setTimeout(() => {
        const heroSection = document.querySelector('[aria-labelledby="hero-heading"]');
        if (heroSection) {
            // Create quality indicator
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                line-height: 1.4;
                pointer-events: none;
            `;
            
            // Check image quality
            const bgImage = heroSection.querySelector('img');
            if (bgImage) {
                const quality = {
                    naturalWidth: bgImage.naturalWidth,
                    naturalHeight: bgImage.naturalHeight,
                    displayWidth: bgImage.clientWidth,
                    displayHeight: bgImage.clientHeight,
                    pixelRatio: window.devicePixelRatio || 1,
                    imageRendering: getComputedStyle(bgImage).imageRendering
                };
                
                const scaleFactor = quality.displayWidth / quality.naturalWidth;
                const isUpscaled = scaleFactor > 1;
                const effectiveResolution = quality.naturalWidth * quality.pixelRatio;
                
                indicator.innerHTML = `
                    <div style="color: ${isUpscaled ? '#ff6b6b' : '#51cf66'};">
                        🖼️ Hero Image Quality Check
                    </div>
                    <div>Natural: ${quality.naturalWidth}×${quality.naturalHeight}</div>
                    <div>Display: ${quality.displayWidth}×${quality.displayHeight}</div>
                    <div>Scale: ${scaleFactor.toFixed(2)}x ${isUpscaled ? '⚠️' : '✅'}</div>
                    <div>Pixel Ratio: ${quality.pixelRatio}</div>
                    <div>Effective: ${effectiveResolution}px ${effectiveResolution >= 1920 ? '✅' : '⚠️'}</div>
                    <div>Rendering: ${quality.imageRendering}</div>
                    <div style="color: ${isUpscaled ? '#ff6b6b' : '#51cf66'};">
                        ${isUpscaled ? 'UPSCALED - May be pixelated' : 'OPTIMAL - Should be crisp'}
                    </div>
                `;
                
                document.body.appendChild(indicator);
                
                // Auto-remove after 10 seconds
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                    }
                }, 10000);
            }
        }
    }, 2000);
}

// Add zoom test function
function addZoomTest() {
    setTimeout(() => {
        const heroSection = document.querySelector('[aria-labelledby="hero-heading"]');
        if (heroSection) {
            const button = document.createElement('button');
            button.textContent = '🔍 Test Zoom';
            button.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;
            
            let isZoomed = false;
            button.onclick = () => {
                if (!isZoomed) {
                    heroSection.style.transform = 'scale(2)';
                    heroSection.style.transformOrigin = 'center center';
                    button.textContent = '🔍 Reset Zoom';
                    isZoomed = true;
                } else {
                    heroSection.style.transform = 'scale(1)';
                    button.textContent = '🔍 Test Zoom';
                    isZoomed = false;
                }
            };
            
            document.body.appendChild(button);
            
            // Auto-remove after 30 seconds
            setTimeout(() => {
                if (button.parentNode) {
                    button.parentNode.removeChild(button);
                }
            }, 30000);
        }
    }, 2000);
}

// Run tests if in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    addQualityIndicators();
    addZoomTest();
}

export { addQualityIndicators, addZoomTest };
