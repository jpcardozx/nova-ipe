'use client';

import { useEffect, useRef, ReactNode, useState } from 'react';

interface InViewObserverProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default InViewObserver;