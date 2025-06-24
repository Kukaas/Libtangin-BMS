import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

const ImageModal = ({ open, onOpenChange, src, alt, caption }) => {
    const [fitMode, setFitMode] = useState('contain'); // 'contain' or 'cover'
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const lastPos = useRef({ x: 0, y: 0 });
    const imgRef = useRef(null);

    // Reset position when modal closes or fitMode changes
    useEffect(() => {
        setPosition({ x: 0, y: 0 });
        lastPos.current = { x: 0, y: 0 };
    }, [open, fitMode, src]);

    const handleMouseDown = (e) => {
        if (fitMode !== 'cover') return;
        setDragging(true);
        lastPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        document.body.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        setPosition({
            x: e.clientX - lastPos.current.x,
            y: e.clientY - lastPos.current.y,
        });
    };

    const handleMouseUp = () => {
        setDragging(false);
        document.body.style.cursor = '';
    };

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 bg-white">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <DialogTitle className="text-lg font-semibold">Image Preview</DialogTitle>
                </div>
                <div className="flex flex-col items-center justify-center px-4 pb-4">
                    <div className="relative w-full flex justify-center items-center bg-slate-100 rounded-lg overflow-hidden" style={{ minHeight: 300, cursor: fitMode === 'cover' ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}>
                        <img
                            ref={imgRef}
                            src={src}
                            alt={alt}
                            className={`max-h-[70vh] transition-all duration-200 ${fitMode === 'contain' ? 'object-contain' : 'object-cover'} w-full select-none`}
                            style={
                                fitMode === 'cover'
                                    ? { transform: `translate(${position.x}px, ${position.y}px)`, cursor: dragging ? 'grabbing' : 'grab' }
                                    : { cursor: 'zoom-in' }
                            }
                            draggable={false}
                            onMouseDown={handleMouseDown}
                            onClick={() => fitMode === 'contain' && setFitMode('cover')}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                            onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
                            title={fitMode === 'contain' ? 'Zoom In' : 'Zoom Out'}
                        >
                            {fitMode === 'contain' ? <ZoomIn className="w-5 h-5" /> : <ZoomOut className="w-5 h-5" />}
                        </Button>
                    </div>
                    {caption && <DialogDescription className="mt-2 text-center text-muted-foreground">{caption}</DialogDescription>}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImageModal;
