import Container from '../components/Container';
import ContentBlock from '../components/ContentBlock';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentBlock 
        title="Agenor Gasparetto"
        imageUrl="/images/agenor.webp"
        description="Possui graduação em Ciências Sociais pela Pontifícia Universidade Católica do Rio Grande do Sul (1982) e mestrado em Sociologia Rural pela Universidade Federal do Rio Grande do Sul (1985)."
        isAuthor
      />

      <h2 className="text-4xl font-extrabold text-primary mb-16 text-center">Livros</h2>
      <div className="flex flex-wrap justify-center gap-16">
        <div onClick={() => navigate('/books/extase')}>
          <ContentBlock 
            title="Êxtase" 
            imageUrl="/images/extase.webp" 
            description="De birra com Jorge Amado e outras crônicas grapiúnas." 
          />
        </div>
        <div onClick={() => navigate('/books/sempre')}>
          <ContentBlock 
            title="Para Sempre Felizes" 
            imageUrl="/images/sempre.webp" 
            description="Coisas de neto." 
          />
        </div>
        <div onClick={() => navigate('/books/regressantes')}>
          <ContentBlock 
            title="Regressantes" 
            imageUrl="/images/regressantes.webp" 
            description="Histórias de luta e resistência." 
          />
        </div>
      </div>
    </Container>
  );
}

export default HomePage;
