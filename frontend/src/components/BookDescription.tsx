import React from 'react';

interface BookDescriptionProps {
  description: string;
}

const BookDescription: React.FC<BookDescriptionProps> = ({ description }) => (
  <div className="mb-8">
    <p className="text-lg text-text-secondary leading-relaxed">{description}</p>
  </div>
);

export default BookDescription;
