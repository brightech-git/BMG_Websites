import React from 'react';
import Content from '../sections/error/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta';

const Error = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: '404 Page Not Found | BMG Jewellers',
        description: 'The page you are looking for does not exist. Return to BMG Jewellers homepage.',
    });

    return <Content />;
};

export default Error;