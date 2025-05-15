import { useNavigate } from 'react-router-dom';
import type { Book } from '../data/books';

const BookDetails: React.FC<Book> = ({ title, imageUrl, price, description, additionalInfo, relatedBooks }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto my-16 px-4">
      <div className="flex flex-col md:flex-row items-start gap-16 mb-16">
        <div className="w-full md:w-1/3 flex justify-center">
          <img src={imageUrl} alt={title} className="w-full max-w-xs rounded-md shadow-md" />
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
          <p className="text-3xl text-secondary font-semibold mb-4">{price}</p>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="bg-background rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-primary mb-4">Informação Adicional</h2>
        <table className="w-full text-left border-t border-b border-primary">
          <tbody>
            {Object.entries(additionalInfo).map(([key, value]) => (
              <tr key={key} className="border-t border-primary">
                <th className="font-semibold py-3 px-4 text-primary bg-background">{key}</th>
                <td className="py-3 px-4 text-text-secondary">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-background rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-primary mb-8 text-center">Livros do Mesmo Autor</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {relatedBooks.map((book) => (
            <div 
              key={book.id} 
              className="bg-background rounded-lg shadow-md overflow-hidden cursor-pointer transition transform hover:scale-105"
              onClick={() => navigate(`/books/${book.id}`)}
            >
              <img src={book.imageUrl} alt={book.title} className="w-full h-72 object-cover rounded-t-lg" />
              <div className="p-4 text-center">
                <h3 className="text-md font-semibold text-primary uppercase">{book.category}</h3>
                <h4 className="text-lg font-bold text-primary mt-1">{book.title}</h4>
                <p className="text-secondary font-semibold">{book.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
