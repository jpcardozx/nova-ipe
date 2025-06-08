'use client';
// Simple test component to validate imports and exports
import React from 'react';
import { PropertyCardUnified } from '@/app/components/ui/property';
import PropertyAdapter from '@/app/components/adapters/PropertyAdapter';

export default function TestImportsComponent() {
    // Log component types
    console.log('PropertyCardUnified type:', typeof PropertyCardUnified);
    console.log('PropertyAdapter type:', typeof PropertyAdapter);

    return (
        <div>
            <h1>Component Import Test</h1>
            <div>
                <h2>PropertyCardUnified</h2>
                {PropertyCardUnified ? (
                    <PropertyCardUnified
                        id="test-id"
                        title="Test Property"
                        slug="test-property"
                        price={500000}
                        propertyType="sale"
                    />
                ) : (
                    <p>PropertyCardUnified is undefined</p>
                )}
            </div>

            <div>
                <h2>PropertyAdapter</h2>
                {PropertyAdapter ? (
                    <PropertyAdapter
                        property={{
                            id: "test-id",
                            title: "Test Property",
                            slug: "test-property",
                            location: "Test Location",
                            city: "Test City",
                            price: 500000,
                            propertyType: "sale",
                            mainImage: {
                                url: "/placeholder-image.jpg",
                                alt: "Test Property"
                            },
                            isHighlight: false,
                            isPremium: false,
                            isNew: false
                        }}
                    />
                ) : (
                    <p>PropertyAdapter is undefined</p>
                )}
            </div>
        </div>
    );
}
