document.addEventListener("DOMContentLoaded", () => {

    const heroBanner = document.querySelector('.hero-banner');
    if (heroBanner) {
        const slideTitle = document.getElementById('slide-title');
        const slideDesc = document.getElementById('slide-desc');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');

        const slides = [
            { title: "Descubra o Nordeste", desc: "Encontre as principais informações, clima e notícias em tempo real.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl-pzV4CN4L3Kn47eB8MYnLLqOLiEtMoJHh8G9fHWiqYOykaBXPL29jDT9&s=10" },
            { title: "Cultura e Tradição", desc: "Explore a riqueza do cordel, do forró e do folclore nordestino.", img: "https://www.travelinn.com.br/blog/wp-content/uploads/2023/07/WhatsApp-Image-2023-07-31-at-17.05.21-2-1024x681.jpeg" },
            { title: "Praias Paradisíacas", desc: "As praias mais desejadas do Brasil estão no Nordeste.", img: "https://blog.blablacar.com.br/wp-content/uploads/2024/04/porto-de-galinhas-pe.webp" }
        ];
        let currentSlide = 0;
        
        function showSlide(i) {
            slideTitle.textContent = slides[i].title;
            slideDesc.textContent = slides[i].desc;
            heroBanner.style.background = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${slides[i].img}') no-repeat center center/cover`;
        }
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => { 
                currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1; 
                showSlide(currentSlide); 
            });
            nextBtn.addEventListener('click', () => { 
                currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1; 
                showSlide(currentSlide); 
            });
        }
        showSlide(0);
    }

    const imageCarouselTrack = document.getElementById('imageCarouselTrack');
    if (imageCarouselTrack) {
        let slideImgIndex = 0;
        const slides = imageCarouselTrack.querySelectorAll('.image-carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const totalSlides = slides.length;
        let autoPlayInterval = null;

        function mudarSlideImg(direction) {
            slideImgIndex = (slideImgIndex + direction + totalSlides) % totalSlides;
            atualizarCarrosselImagem();
        }

        function irParaSlideImg(index) {
            slideImgIndex = index;
            atualizarCarrosselImagem();
        }

        function atualizarCarrosselImagem() {
            imageCarouselTrack.style.transform = `translateX(-${slideImgIndex * 100}%)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === slideImgIndex);
            });
        }

        function iniciarAutoPlayImg() {
            if (autoPlayInterval) return;
            autoPlayInterval = setInterval(() => {
                mudarSlideImg(1);
            }, 5000);
        }

        function pararAutoPlayImg() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        const prevImgBtn = document.getElementById('prevImgBtn');
        const nextImgBtn = document.getElementById('nextImgBtn');
        
        if (prevImgBtn) {
            prevImgBtn.addEventListener('click', () => mudarSlideImg(-1));
        }
        if (nextImgBtn) {
            nextImgBtn.addEventListener('click', () => mudarSlideImg(1));
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                irParaSlideImg(index);
            });
        });

        const container = document.querySelector('.image-carousel-container');
        if (container) {
            container.addEventListener('mouseenter', pararAutoPlayImg);
            container.addEventListener('mouseleave', iniciarAutoPlayImg);
        }

        iniciarAutoPlayImg();
    }

    const tickerContainer = document.getElementById('moedas-ticker');
    if (tickerContainer) {
        async function carregarCotacoes() {
            try {
                const res = await fetch("https://br.dolarapi.com/v1/cotacoes/usd");
                const json = await res.json();
                const compra = json.compra.toFixed(2);
                const venda = json.venda.toFixed(2);
                tickerContainer.innerHTML = `<i class="fa-solid fa-chart-line"></i> Dólar Comercial — Compra: R$ ${compra} | Venda: R$ ${venda} | <i class="fa-solid fa-euro-sign"></i> Euro: R$ ${(compra * 1.08).toFixed(2)}`;
            } catch (e) {
                tickerContainer.textContent = 'Cotação indisponível no momento.';
            }
        }
        carregarCotacoes();
        setInterval(carregarCotacoes, 300000);
    }

    const weatherSelect = document.getElementById('weather-select-state');
    if (weatherSelect) {
        const cityCoordinates = {
            "Fortaleza,CE": { lat: -3.73, lon: -38.52, name: "Fortaleza - CE" },
            "Salvador,BA": { lat: -12.97, lon: -38.50, name: "Salvador - BA" },
            "Recife,PE": { lat: -8.05, lon: -34.88, name: "Recife - PE" },
            "Natal,RN": { lat: -5.79, lon: -35.20, name: "Natal - RN" },
            "Maceio,AL": { lat: -9.66, lon: -35.73, name: "Maceió - AL" },
            "Aracaju,SE": { lat: -10.91, lon: -37.06, name: "Aracaju - SE" },
            "Joao Pessoa,PB": { lat: -7.11, lon: -34.86, name: "João Pessoa - PB" },
            "Sao Luis,MA": { lat: -2.53, lon: -44.30, name: "São Luís - MA" },
            "Teresina,PI": { lat: -5.09, lon: -42.80, name: "Teresina - PI" }
        };

        async function buscarClima(cityKey) {
            const coords = cityCoordinates[cityKey] || cityCoordinates["Fortaleza,CE"];
            
            document.getElementById('clima-cidade').textContent = coords.name;
            document.getElementById('clima-temp').textContent = '--°C';
            document.getElementById('clima-vento').textContent = '-- km/h';
            document.getElementById('clima-umidade').textContent = '--%';
            document.getElementById('clima-desc').textContent = 'Carregando dados...';

            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&timezone=America/Fortaleza`);
                
                if (!res.ok) {
                    throw new Error(`Erro HTTP: ${res.status}`);
                }
                
                const data = await res.json();
                
                if (data.current_weather) {
                    const temp = Math.round(data.current_weather.temperature);
                    const vento = data.current_weather.windspeed;
                    
                    document.getElementById('clima-temp').textContent = `${temp}°C`;
                    document.getElementById('clima-vento').textContent = `${vento} km/h`;
                    
                    const umidade = Math.round(65 + Math.random() * 25);
                    document.getElementById('clima-umidade').textContent = `${umidade}%`;
                    
                    let descricao = "Tempo típico regional";
                    if (temp > 30) descricao = "☀️ Dia quente e ensolarado";
                    else if (temp > 25) descricao = "🌤️ Clima agradável e aberto";
                    else if (temp > 20) descricao = "🌥️ Temperatura amena, ótimo para passeios";
                    else descricao = "🌧️ Clima mais fresco, pode chover";
                    
                    document.getElementById('clima-desc').textContent = descricao;
                } else {
                    throw new Error('Dados incompletos');
                }
            } catch (e) {
                console.error("Erro ao buscar clima:", e);
                document.getElementById('clima-desc').textContent = "⚠️ Erro ao carregar dados";
                document.getElementById('clima-temp').textContent = '--°C';
                document.getElementById('clima-vento').textContent = '-- km/h';
                document.getElementById('clima-umidade').textContent = '--%';
            }
        }

        weatherSelect.addEventListener('change', (e) => {
            buscarClima(e.target.value);
        });

        buscarClima("Fortaleza,CE");
    }

    const noticias = [
        {
            id: 1,
            titulo: "Fortaleza inaugura praia flutuante tecnológica",
            resumo: "Nova atração construída sobre plataformas no mar combina tecnologia, lazer e turismo em uma experiência futurista inédita.",
            data: "15/06/2026",
            categoria: "Tecnologia e Turismo",
            imagem: "https://s1.static.brasilescola.uol.com.br/be/2021/06/foto-aerea-fortaleza.jpg",
            conteudo: "Fortaleza, CE — A capital cearense inaugurou a primeira praia flutuante tecnológica do Brasil, construída sobre plataformas móveis no mar. O espaço conta com areia sintética, ondas artificiais e coqueiros holográficos que mudam de cor à noite. O projeto foi desenvolvido por engenheiros locais e promete unir inovação e turismo. “Queremos oferecer uma experiência inédita, sem perder o clima acolhedor de Fortaleza”, disse a prefeita. Turistas já lotam o espaço, descrevendo a sensação como “estar em uma praia futurista”. Além de lazer, a praia terá shows noturnos com projeções digitais sobre as ondas. A expectativa é que o local se torne um dos principais cartões-postais da cidade.  "},
        {
            id: 2,
            titulo: "Recife lança metrô subaquático",
            resumo: "Sistema de transporte inovador permite observar a vida marinha durante o trajeto e promete melhorar a mobilidade urbana.",
            data: "14/06/2026",
            categoria: "Mobilidade Urbana",
            imagem: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Recife_station%2C_Recife_Metro%2C_15-02-2024.jpg",
            conteudo: "Recife, PE — O Recife inaugurou o primeiro metrô subaquático do mundo, que passa sob canais históricos da cidade. Os vagões possuem janelas panorâmicas, permitindo aos passageiros observar peixes e corais durante o trajeto. Autoridades destacam que o projeto une mobilidade urbana e turismo. “É transporte público e aquário ao mesmo tempo”, brincou um passageiro na viagem inaugural. O metrô deve reduzir o trânsito na região central e já virou atração turística internacional. A obra levou cinco anos para ser concluída e contou com tecnologia de ponta. Especialistas afirmam que o modelo pode inspirar outras cidades costeiras.  "},
        {
            id: 3,
            titulo: "Salvador cria carnaval fora de época",
            resumo: "Evento inspirado nas fases da lua reúne foliões em um carnaval temático que mistura cultura, astronomia e entretenimento.",
            data: "21/06/2026",
            categoria: "Cultura e Eventos",
            imagem: "https://home.centraldocarnaval.com.br/conteudo/des/001/cont/images/WhatsApp%20Image%202023-11-30%20at%2017_41_28%20(1).jpeg",
            conteudo: "Salvador, BA — A cidade lançou o Carnaval Lunar, sincronizado com as fases da lua. Os trios elétricos desfilam apenas em noites de lua cheia, criando um espetáculo de luzes e energia. Turistas apelidaram o evento de “Carnaval Místico”. Segundo os organizadores, a ideia é unir tradição e astronomia. “É o encontro da cultura baiana com o cosmos”, declarou um dos criadores. A primeira edição atraiu milhares de foliões vestidos de estrelas e planetas. O evento também contou com shows temáticos e decoração inspirada no espaço. Salvador espera consolidar o carnaval lunar como atração anual.  "},
        {
            id: 4,
            titulo: "Natal inaugura maior parque de energia eólica flutuante do mundo",
            resumo: "Complexo marítimo gera energia limpa para a cidade e transforma Natal em referência internacional em sustentabilidade.",
            data: "20/06/2026",
            categoria: "Sustentabilidade",
            imagem: "https://www.fishtv.com/uploads/noticias/principal/546x268/284_rio-grande-do-norte-tem-potencial-mundial-para-geracao-de-energia-eolica.jpg",
            conteudo: "Natal, RN — A capital potiguar inaugurou o maior parque eólico flutuante do planeta. As turbinas instaladas no mar geram energia suficiente para abastecer toda a cidade. “É um marco para o futuro sustentável do Brasil”, disse o governador. Além da função energética, o parque virou atração turística, com passeios de barco entre as turbinas. O projeto foi financiado por empresas nacionais e internacionais. Especialistas afirmam que o modelo pode ser replicado em outras cidades costeiras. Moradores comemoraram a redução na conta de luz após a inauguração. Natal agora é referência mundial em energia limpa."},
        {
            id: 5,
            titulo: "No sertão do Piauí é descoberto lago subterrâneo gigante",
            resumo: "Descoberta de um reservatório subterrâneo colossal pode garantir água para a região por até 200 anos.",
            data: "19/06/2026",
            categoria: "Meio Ambiente",
            imagem: "https://s2-g1.glbimg.com/4QbuqIgfbAbqcRqnUcbsbuifXN0=/0x0:1080x671/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/a/7/hA0xnaTZSzF32IUPNAtA/whatsapp-image-2022-07-21-at-09.49.17.jpeg",
            conteudo: "Piauí — Cientistas anunciaram a descoberta de um lago subterrâneo colossal no sertão piauiense. Estima-se que o reservatório possa abastecer a região por até 200 anos. Moradores comemoraram como um milagre. “É como se o sertão tivesse encontrado sua fonte eterna”, disse um agricultor emocionado. Pesquisadores já estudam formas de explorar o lago sem prejudicar o ecossistema local. A descoberta pode transformar a economia da região, garantindo água para agricultura e consumo. Autoridades planejam criar um parque científico para monitorar o reservatório. O sertão vive agora um clima de esperança renovada.  "},
        {
            id: 6,
            titulo: "Aracaju lança festival gastronômico de comidas futuristas",
            resumo: "Evento apresenta versões tecnológicas de pratos tradicionais nordestinos e discute o futuro da alimentação sustentável.O Índice de Desenvolvimento da Educação Básica cresceu em todos os estados, com destaque para o Ceará.",
            data: "18/06/2026",
            categoria: "Gastronomia",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbslM3lCYOJL4zpERXG9m_TvcKWM98XaOs_Y0KOmV9xDBBQA2naT_vFIt&s=10",
            conteudo: "Aracaju, SE — A cidade inaugurou o Festival Gastronômico Futurista, com pratos criados a partir de ingredientes cultivados em laboratório. Entre as atrações estão a “carne de sol sintética” e o “bolo de rolo molecular”. Chefs afirmam que o evento une tradição e inovação. Visitantes relatam surpresa ao provar pratos que mantêm o sabor original, mas com técnicas de alta tecnologia. “É o futuro da comida nordestina”, disse um chef participante. O festival também inclui palestras sobre sustentabilidade alimentar. Aracaju espera atrair turistas e consolidar-se como polo gastronômico inovador.  "},
        {
            id: 7,
            titulo: "Maranhão cria cinema holográfico nos Lençóis Maranhenses",
            resumo: "Filmes projetados em hologramas sobre as dunas oferecem uma experiência cultural inédita para turistas e moradores.",
            data: "17/06/2026",
            categoria: "Cultura e Turismo",
            imagem: "https://s2-g1.glbimg.com/MLqICCKpqVXj6_-ngfR4S59CF1g=/0x0:620x465/984x0/smart/filters:strip_icc()/s.glbimg.com/jo/g1/f/original/2013/02/22/teatrocidade.jpg",
            conteudo: "Barreirinhas, MA — Os Lençóis Maranhenses receberam o primeiro cinema holográfico ao ar livre. Filmes são projetados diretamente nas dunas, com imagens em 3D que parecem interagir com o ambiente. “É como se os personagens caminhassem sobre a areia junto com a plateia”, relatou um turista encantado. O projeto busca valorizar o turismo e transformar o parque em palco cultural permanente. A estreia contou com a exibição de clássicos brasileiros em versão holográfica. Autoridades afirmam que o cinema será realizado em temporadas anuais. O evento já atraiu visitantes internacionais e promete crescer nos próximos anos.  "},
        {
            id: 8,
            titulo: "Bahia anuncia campeonato de capoeira com realidade aumentada",
            resumo: "Competição une tradição e tecnologia com efeitos visuais que tornam as apresentações ainda mais impressionantes.",
            data: "16/06/2026",
            categoria: "Esportes e Cultura",
            imagem: "https://images.tcdn.com.br/img/img_prod/656057/oculos_vr_realidade_virtual_oculus_quest_2_128gb_1141_1_9c02ce6db37501c60091f1a924fb6de7.jpg",
            conteudo: "Salvador, BA — A Bahia lançou o primeiro campeonato de capoeira com realidade aumentada. Os lutadores usam óculos especiais que adicionam efeitos visuais às acrobacias, como chamas e explosões virtuais. O evento promete atrair jovens e transformar a capoeira em espetáculo tecnológico sem perder sua essência cultural. “É a tradição dialogando com o futuro”, declarou o mestre responsável pela competição. A primeira edição reuniu capoeiristas de vários países. O público vibrou com os efeitos visuais que tornaram as lutas ainda mais emocionantes. Salvador planeja expandir o campeonato para outras cidades.  "},
        {
            id: 9,
            titulo: "Pernambuco inaugura museu do frevo interplanetário",
            resumo: "Novo museu permite experimentar o frevo em ambientes que simulam a gravidade da Lua e de Marte.",
            data: "15/06/2026",
            categoria: "Cultura",
            imagem: "https://cdn.assets-casacor.tec.br/file/casacor-images-news/2026/02/frevo-dancers-olinda-pernambuco-brazil-gn8y8359.webp",
            conteudo: "Recife, PE — O novo Museu Interplanetário do Frevo simula como seria a dança tradicional pernambucana em Marte e na Lua. Visitantes podem experimentar gravidade reduzida em salas especiais e dançar com trajes espaciais. “É o frevo atravessando fronteiras e chegando ao espaço sideral”, disse o diretor do museu. A atração já é considerada uma das mais inovadoras do país. O espaço conta também com exposições interativas e oficinas para crianças. Turistas relatam que a experiência é “divertida e surreal”. Recife espera aumentar o fluxo turístico com a novidade.  "},
        {
            id: 10,
            titulo: "Ceará lança drones para distribuir água no sertão",
            resumo: "Programa utiliza drones movidos a energia solar para levar água potável a comunidades isoladas pela seca.",
            data: "14/06/2026",
            categoria: "Tecnologia e Sociedade",
            imagem: "https://s2-g1.glbimg.com/R_OekG7Rugkce1IW4JUyMYf4Ink=/0x0:668x547/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/W/A/RAGzsBQ6Wvy2AoAxGv0w/drones.png",
            conteudo: "Ceará — O governo estadual lançou um programa inovador: drones que distribuem água potável em comunidades isoladas do sertão. Os aparelhos transportam garrafas e caixas de água, pousando diretamente nas casas dos moradores. “É como se a esperança viesse voando”, disse uma moradora beneficiada. A iniciativa deve reduzir os impactos da seca e já recebeu elogios de organizações internacionais. Os drones são movidos a energia solar e podem percorrer longas distâncias. O projeto piloto já atende dezenas de comunidades. Autoridades planejam expandir a frota nos próximos anos.  "},
        {
            id: 11,
            titulo: "João Pessoa inaugura observatório astronômico flutuante  ",
            resumo: "Estrutura instalada sobre o mar oferece observação do céu e fortalece o turismo científico na Paraíba.",
            data: "13/06/2026",
            categoria: "Ciência e Tecnologia",
            imagem: "https://uploads.polemicaparaiba.com.br/2021/05/WhatsApp-Image-2021-05-26-at-10.28.37-1.jpeg",
            conteudo: "A capital paraibana inaugurou o primeiro observatório astronômico flutuante do Brasil, instalado em uma plataforma no mar próximo à orla. O espaço conta com telescópios modernos, áreas para pesquisas e visitas guiadas para estudantes e turistas. Segundo os organizadores, a distância das luzes urbanas permite uma observação mais nítida do céu noturno. A expectativa é que a atração fortaleça o turismo científico e atraia visitantes de diversas regiões do país."},
        {
            id: 12,
            titulo: "Maceió cria resort suspenso entre coqueiros  ",
            resumo: "Resort inovador com cabanas elevadas proporciona contato com a natureza e vista privilegiada para o litoral.",
            data: "12/06/2026",
            categoria: "Turismo",
            imagem: "https://images.trvl-media.com/lodging/97000000/96920000/96914900/96914850/0ab2e5a9.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
            conteudo: "Maceió, AL — Um novo resort construído entre as copas dos coqueiros foi inaugurado na orla de Maceió. As cabanas suspensas oferecem vista panorâmica para o mar e utilizam sistemas sustentáveis de energia e ventilação natural. O empreendimento busca unir conforto, contato com a natureza e preservação ambiental. A novidade já desperta interesse de turistas em busca de experiências diferenciadas no litoral alagoano."},
        {
            id: 13,
            titulo: "Teresina inaugura ônibus espacial urbano",
            resumo: "Veículo temático transforma o transporte público em uma experiência imersiva inspirada em viagens espaciais.",
            data: "11/06/2026",
            categoria: "Tecnologia",
            imagem: "https://s2-g1.glbimg.com/ZDK1C_QF41ZHXsuINCj6cuyOLnE=/0x0:1280x853/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2019/H/q/bwQhBzSKOoAeeIDydG0Q/parada-saci-2.jpg",
            conteudo: "Teresina, PI — A prefeitura de Teresina apresentou um ônibus temático que transforma viagens comuns em experiências imersivas inspiradas no espaço. Equipado com telas interativas, efeitos sonoros e realidade virtual, o veículo simula missões espaciais durante os trajetos. O projeto tem como objetivo tornar o transporte público mais atrativo e estimular o interesse dos jovens por ciência e tecnologia."
        },
        {
            id: 14,
            titulo: "Olinda transforma casarões históricos em museus digitais",
            resumo: "Tecnologia de projeção e hologramas dá vida à história dos casarões e valoriza o patrimônio cultural.",
            data: "15/06/2026",
            categoria: "Cultura e Patrimônio",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw4Pc3QfmoLfWWy31kLn2GE36RbXGUHWuD9SK-5HjiJmYwENI39Q5zVdM1&s=10",
            conteudo: "Olinda, PE — Casarões históricos do centro de Olinda passaram a receber projeções digitais e exposições interativas que contam a história da cidade. As fachadas exibem imagens, animações e personagens históricos por meio de tecnologia de mapeamento visual. A iniciativa busca aproximar moradores e turistas do patrimônio cultural local, combinando tradição e inovação em uma experiência única."
        },
        {
            id: 15,
            titulo: "São Luís inaugura ponte musical sobre o mar",
            resumo: "Sensores transformam os passos dos pedestres em notas musicais, criando uma travessia interativa.",
            data: "22/06/2026",
            categoria: "Infraestrutura e Cultura",
            imagem: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Estreito_dos_Mosquitos.jpg",
            conteudo: "São Luís, MA — Uma nova ponte para pedestres inaugurada em São Luís vem chamando atenção por sua tecnologia inovadora. Sensores instalados no piso transformam os passos dos visitantes em notas musicais, criando melodias diferentes a cada travessia. O projeto foi desenvolvido para incentivar o turismo e oferecer um novo espaço de lazer e interação para moradores e visitantes."
        },
        {
            id: 16,
            titulo: "Campina Grande lança festa junina com fogueiras digitais",
            resumo: "Espetáculo de luzes e projeções moderniza as tradicionais fogueiras sem perder a essência da festa.",
            data: "20/06/2026",
            categoria: "Cultura e Eventos",
            imagem: "https://blog.123milhas.com/wp-content/uploads/2022/05/festa-junina-de-campina-grande-o-maior-sao-joao-do-mundo-o-maior-sao-do-mundo-em-campina-grande-conexao123-1.jpg",
            conteudo: "Campina Grande, PB — A cidade de Campina Grande comemora a festa junina com uma nova experiência digital. Fogueiras artificiais iluminadas por tecnologia LED transformam o evento em uma apresentação visual impressionante. O projeto visa atrair mais visitantes e promover a cultura local de forma inovadora."
        },
        {
            id: 17,
            titulo: "Maragogi cria aquário natural com realidade aumentada",
            resumo: "Turistas podem visualizar informações sobre a fauna marinha em tempo real durante os mergulhos.",
            data: "15/06/2026",
            categoria: "Meio Ambiente e Turismo",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2GPDl0-1qLHNR_imBTWhe5Zp3DnMv5ZcpsWL5So5Wwv2ekTv-YJ7f-e2G&s=10",
            conteudo: "Maragogi, AL — Visitantes das famosas piscinas naturais de Maragogi agora podem utilizar óculos de realidade aumentada para conhecer melhor a fauna marinha local. O equipamento exibe informações sobre peixes, corais e espécies encontradas durante o passeio. A iniciativa tem foco educativo e busca incentivar a preservação ambiental por meio da tecnologia."
        },
        {
            id: 18,
            titulo: "Aracaju inaugura parque temático dos ventos",
            resumo: "Novo espaço combina diversão, ciência e sustentabilidade com atrações movidas pela força do vento.",
            data: "17/06/2026",
            categoria: "Turismo e Sustentabilidade",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8UeM6HO9-E0EwQJDeyUlNnE16_jPNZ5YScOZ4gW5-mgIf9va_hwYtvyCe&s=10",
            conteudo: "Aracaju, SE — O parque temático dos ventos em Aracaju é uma nova atração que combina lazer e sustentabilidade. Com instalções de energia eólica, o local oferece experiências únicas para visitantes de todas as idades. O projeto visa promover a conscientização ambiental e incentivar o uso de energias renováveis."
        },
        {
            id: 19,
            titulo: "Sobral cria festival solar noturno",
            resumo: "Evento utiliza energia solar para iluminar apresentações culturais e espetáculos visuais durante a noite.",
            data: "22/06/2026",
            categoria: "Ciência e Cultura",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2_q9O2avmQkH_EsoG6_blqdz5mTh0ogYqLSXamqQ-rhSJBqDK8kqpsS8&s=10",
            conteudo: "Sobral, CE — O festival solar noturno em Sobral é uma nova iniciativa que combina entretenimento e sustentabilidade. Com apresentações musicais e shows de luzes solares, o evento visa promover a conscientização ambiental e incentivar o uso de energias renováveis."
        },
        {
            id: 20,
            titulo: "Ilhéus inaugura teatro submerso",
            resumo: "Teatro construído sob o mar oferece apresentações cercadas pela paisagem marinha da costa baiana.",
            data: "15/06/2026",
            categoria: "Cultura",
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGiaXQ2KPgec6l0NRIyuDOBUGs4HkmpAqxL7pZz9z-KaA5uyyrIIgQIuo&s=10",
            conteudo: "Ilhéus, BA — O teatro submerso em Ilhéus é uma nova atração que combina arte e tecnologia. Os visitantes podem desfrutar de apresentações musicais e teatrais enquanto estão submersos em uma piscina especial, criando uma experiência única e imersiva. O projeto visa promover a conscientização ambiental e incentivar o uso de energias renováveis."
        },
        {
            id: 21,
            titulo: "Caruaru lança mercado de alimentos cultivados em estufas espaciais",
            resumo: "Mercado apresenta produtos produzidos com tecnologias agrícolas inspiradas em futuras missões espaciais.",
            data: "18/06/2026",
            categoria: "Agronegócio e Tecnologia",
            imagem: "https://i0.wp.com/falape.com/wp-content/uploads/2022/04/9bfe928c-e703-453e-b75c-e9db19cd2c9a.jpg?resize=350%2C200&ssl=1",
            conteudo: "Caruaru, PE — O mercado de alimentos cultivados em estufas espaciais em Caruaru é uma nova iniciativa que combina tecnologia e sustentabilidade. Os produtos são produzidos em ambientes controlados, garantindo qualidade e frescor. O projeto visa promover a conscientização ambiental e incentivar o uso de energias renováveis."
        },
        {
            id: 22,
            titulo: "São Luís cria parque interativo de aves falantes",
            resumo: "Atração promove educação ambiental por meio da interação divertida entre visitantes e aves treinadas.",
            data: "22/06/2026",
            categoria: "Meio Ambiente e Turismo",
            imagem: "https://image.portaldacidade.com/unsafe/https://bucket.portaldacidade.com/paranavai.portaldacidade.com/img/news/2023-05/zoologico-de-aves-silvestres-sera-inaugurado-na-regiao-de-paranavai-6463d5488eeda.jpeg",
            conteudo: "São Luís, MA — Um novo parque interativo de aves falantes em São Luís oferece uma experiência única de aprendizado e entretenimento. Os visitantes podem observar e ouvir diversas espécies de aves em um ambiente natural e seguro. O projeto visa promover a conscientização ambiental e incentivar o uso de energias renováveis."
        }
    ];

    let noticiasCarregadas = 0;
    const noticiasPorVez = 10;

    function renderizarNoticias() {
        const colunaEsquerda = document.getElementById('news-column-left');
        const colunaDireita = document.getElementById('news-column-right');
        if (!colunaEsquerda || !colunaDireita) return;
        
        if (noticiasCarregadas === 0) {
            colunaEsquerda.innerHTML = '';
            colunaDireita.innerHTML = '';
        }
        
        const noticiasExibir = noticias.slice(noticiasCarregadas, noticiasCarregadas + noticiasPorVez);
        
        noticiasExibir.forEach((noticia, index) => {
            const card = document.createElement('div');
            card.className = 'news-item';
            card.dataset.id = noticia.id;
            card.innerHTML = `
                <img src="${noticia.imagem}" alt="${noticia.titulo}" class="news-img">
                <div class="news-body">
                    <span class="news-tag">${noticia.categoria}</span>
                    <span class="news-data"><i class="fa-regular fa-calendar"></i> ${noticia.data}</span>
                    <h3>${noticia.titulo}</h3>
                    <p class="news-resumo">${noticia.resumo}</p>
                    <a href="#" class="btn-ler-mais" data-id="${noticia.id}">Ler mais <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            `;
            
            if (index % 2 === 0) {
                colunaEsquerda.appendChild(card);
            } else {
                colunaDireita.appendChild(card);
            }
        });
        
        noticiasCarregadas += noticiasExibir.length;
        
        const btnCarregarMais = document.getElementById('btnCarregarMais');
        if (noticiasCarregadas >= noticias.length) {
            btnCarregarMais.style.display = 'none';
        }
    }

    const modal = document.getElementById('modalNoticia');
    const modalClose = document.getElementById('modalClose');

    function abrirModal(id) {
        const noticia = noticias.find(n => n.id === id);
        if (!noticia) return;

        document.getElementById('modalTitulo').textContent = noticia.titulo;
        document.getElementById('modalData').innerHTML = `<i class="fa-regular fa-calendar"></i> ${noticia.data}`;
        document.getElementById('modalCategoria').innerHTML = `<i class="fa-solid fa-tag"></i> ${noticia.categoria}`;
        document.getElementById('modalImagem').src = noticia.imagem;
        document.getElementById('modalImagem').alt = noticia.titulo;
        document.getElementById('modalConteudo').textContent = noticia.conteudo;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function fecharModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    if (modalClose && modal) {
        modalClose.addEventListener('click', fecharModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            fecharModal();
        }
    });

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-ler-mais');
        if (btn) {
            e.preventDefault();
            const id = parseInt(btn.dataset.id);
            abrirModal(id);
        }
    });

    const btnCarregarMais = document.getElementById('btnCarregarMais');
    if (btnCarregarMais) {
        btnCarregarMais.addEventListener('click', renderizarNoticias);
    }

    if (document.getElementById('news-column-left') && document.getElementById('news-column-right')) {
        renderizarNoticias();
    }

    const mapaContainer = document.getElementById("mapaNordeste");
    if (mapaContainer) {
        async function carregarMapa() {
            try {
                const resposta = await fetch("vetor_nordeste.svg");
                const svgTexto = await resposta.text();
                mapaContainer.innerHTML = svgTexto;
                iniciarMapa();
            } catch (erro) {
                mapaContainer.innerHTML = "<p>🗺️ Mapa interativo em breve</p>";
                console.error(erro);
            }
        }

        function iniciarMapa() {
            const estados = document.querySelectorAll(".mapa-svg .estado");
            const painelVazio = document.getElementById("painelVazio");
            const painelConteudo = document.getElementById("painelConteudo");
            const estadoNome = document.getElementById("estadoNome");
            const estadoDescricao = document.getElementById("estadoDescricao");
            const estadoImagem = document.getElementById("estadoImagem");
            const estadoDestinos = document.getElementById("estadoDestinos");
            const estadoLink = document.getElementById("estadoLink");

            const dadosEstados = {
                ceara: {
                    nome: "Ceará",
                    descricao: "O Ceará é um dos destinos mais visitados do Nordeste, com praias paradisíacas e rica cultura.",
                    imagem: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
                    destinos: ["Jericoacoara", "Fortaleza", "Canoa Quebrada"],
                    link: "ceara.html"
                },
                bahia: {
                    nome: "Bahia",
                    descricao: "A Bahia mistura história, cultura e praias inesquecíveis.",
                    imagem: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                    destinos: ["Salvador", "Porto Seguro", "Chapada Diamantina"],
                    link: "bahia.html"
                }
            };

            estados.forEach((estado) => {
                estado.addEventListener("click", (e) => {
                    e.preventDefault();
                    const id = estado.id?.toLowerCase();
                    const nomeAttr = estado.getAttribute("name")?.toLowerCase();
                    const chave = dadosEstados[id] ? id : dadosEstados[nomeAttr] ? nomeAttr : null;

                    if (!chave || !painelConteudo) return;

                    const dados = dadosEstados[chave];

                    if (painelVazio) painelVazio.classList.add("oculto");
                    if (painelConteudo) painelConteudo.classList.remove("oculto");

                    if (estadoNome) estadoNome.textContent = dados.nome;
                    if (estadoDescricao) estadoDescricao.textContent = dados.descricao;
                    if (estadoImagem) {
                        estadoImagem.src = dados.imagem;
                        estadoImagem.alt = dados.nome;
                    }
                    if (estadoLink) estadoLink.href = dados.link;

                    if (estadoDestinos) {
                        estadoDestinos.innerHTML = "";
                        dados.destinos.forEach((destino) => {
                            const li = document.createElement("li");
                            li.textContent = destino;
                            estadoDestinos.appendChild(li);
                        });
                    }
                });
            });
        }

        carregarMapa();
    }

    const conteudoCultura = document.getElementById('conteudo-cultura');
    if (conteudoCultura) {
        
        const dadosCulturais = {
            alagoas: {
                girias: [
                    { palavra: "Ai dento", significado: "Expressão de negação, 'sai fora' ou 'vai se danar'", exemplo: "Fiquei sabendo que você ficou de rolo com a Maria. Ai dento, nem pensar." },
                    { palavra: "Estribado", significado: "Pessoa rica, com muita grana", exemplo: "Aquele lá ficou estribado e nunca mais falou com a gente." },
                    { palavra: "Farrapar", significado: "Marcar um compromisso e não comparecer, sem avisar", exemplo: "Estou esperando a Solange há duas horas. Acho que ele vai farrapar." },
                    { palavra: "Iapois", significado: "Usado para afirmar ou confirmar algo", exemplo: "Vamos jogar bola amanhã? Iapois." },
                    { palavra: "Lomba errada", significado: "Algo complicado, polêmico", exemplo: "Viu aquela briga na rua? Mas que lomba errada." },
                    { palavra: "Pagar sapo", significado: "Passar vergonha", exemplo: "Só saí de casa para pagar sapo hoje." },
                    { palavra: "Peidado", significado: "Nervoso, indignado", exemplo: "Fiquei peidado com minha professora depois da prova." },
                    { palavra: "Rafamé", significado: "Algo ou alguém que não vale nada, não presta", exemplo: "Não confia que aquele ali é rafamé. Nossa, este material é muito rafamé." },
                    { palavra: "Se amostra", significado: "Dizer que algo é muito bom", exemplo: "Aquele podrão da rua ali de baixo se amostra." }
                ],
                costumes: [
                    { titulo: "Guerreiro alagoano", descricao: "Folguedo popular tradicional de Alagoas." },
                    { titulo: "Pastoril", descricao: "Apresentação cultural natalina muito tradicional em Alagoas." },
                    { titulo: "Consumo de sururu", descricao: "Prato típico alagoano, muito apreciado localmente." },
                    { titulo: "Pesca em lagoas", descricao: "Atividade tradicional presente em todo o estado de Alagoas." },
                    { titulo: "Artesanato com renda filé", descricao: "Patrimônio cultural alagoano de grande valor." },
                    { titulo: "Festas de padroeiros", descricao: "Celebrações religiosas muito populares em Alagoas." },
                    { titulo: "Quadrilhas juninas", descricao: "Parte importante das festas de São João em Alagoas." },
                    { titulo: "Feiras de artesanato", descricao: "Tradição econômica e cultural importante em Alagoas." },
                    { titulo: "Uso de embarcações tradicionais", descricao: "Nas lagoas, mantendo a tradição alagoana." },
                    { titulo: "Mutirões comunitários", descricao: "Ajuda entre moradores em tarefas coletivas em Alagoas." },
                    { titulo: "Serestas e apresentações musicais", descricao: "Eventos frequentes nas cidades alagoanas." }
                ],
                cultura: [
                    { titulo: "Renda Filé", descricao: "Principal símbolo artesanal do estado de Alagoas." },
                    { titulo: "Lagoas e canais", descricao: "Elementos centrais da identidade local alagoana." },
                    { titulo: "Cultura dos pescadores", descricao: "Muito presente no litoral alagoano." },
                    { titulo: "Quilombo dos Palmares", descricao: "Marco histórico nacional em Alagoas." },
                    { titulo: "Artesanato tradicional", descricao: "Grande diversidade de técnicas em Alagoas." },
                    { titulo: "Folguedos populares", descricao: "Guerreiro, pastoril e reisado em Alagoas." },
                    { titulo: "Centro Histórico de Penedo", descricao: "Patrimônio cultural de Alagoas." },
                    { titulo: "Influência afro-brasileira", descricao: "Muito forte nas tradições locais de Alagoas." },
                    { titulo: "Música regional", descricao: "Forró e manifestações populares em Alagoas." },
                    { titulo: "Museus históricos", descricao: "Preservação da memória estadual de Alagoas." },
                    { titulo: "Festas tradicionais do interior", descricao: "Importantes para a cultura local de Alagoas." }
                ]
            },
            bahia: {
                girias: [
                    { palavra: "Aluado", significado: "Quem fica no mundo da lua, que faz muita besteira, fala sem pensar", exemplo: "Você falou aquilo mesmo com ela? É aluado, é?" },
                    { palavra: "Barril", significado: "Algo muito bom, mas também pode ser algo difícil ou perigoso", exemplo: "Vai ter uma festa barril este fim de semana. Mainha falou que aquele lugar lá é barril." },
                    { palavra: "Comer água", significado: "Ingerir bebida alcoólica com a intenção de ficar bêbado", exemplo: "Ninguém me segura que hoje eu vou comer água!" },
                    { palavra: "Espótico", significado: "Pessoa exibida, animada, sem regras", exemplo: "Desça daí, Luana! Pare de ser espótica." },
                    { palavra: "Laele (Lá ele)", significado: "Usada quando se quer negar algo", exemplo: "Fiquei sabendo que você ficou muito doido na festa ontem. Laele." },
                    { palavra: "Migué", significado: "Enrolar, tentar falar algo só para convencer alguém", exemplo: "Você disse que ia aparecer ontem e depois deu um migué." },
                    { palavra: "Ôxe", significado: "Expressão de surpresa ou espanto", exemplo: "Ôxe, que bom que você veio. Ôxe, por que você está nervosa assim?" },
                    { palavra: "Tô na bruxa", significado: "Estar com raiva, irritado", exemplo: "Não venha falar comigo que hoje eu tô na bruxa." }
                ],
                costumes: [
                    { titulo: "Lavagem do Bonfim", descricao: "Festa religiosa e cultural tradicional da Bahia." },
                    { titulo: "Capoeira", descricao: "Expressão cultural afro-brasileira presente nas ruas da Bahia." },
                    { titulo: "Acarajé nas ruas", descricao: "Tradição gastronômica baiana muito popular." },
                    { titulo: "Samba de roda", descricao: "Patrimônio cultural da Bahia." },
                    { titulo: "Festa de Iemanjá", descricao: "Celebração religiosa popular muito tradicional na Bahia." },
                    { titulo: "Carnaval de trio elétrico", descricao: "Marca registrada da Bahia." },
                    { titulo: "Uso de roupas brancas em festas religiosas", descricao: "Costume tradicional baiano." },
                    { titulo: "Artesanato em fitas do Bonfim", descricao: "Símbolo cultural da Bahia." },
                    { titulo: "Consumo de moqueca baiana", descricao: "Prato típico da culinária baiana." },
                    { titulo: "Blocos afros", descricao: "Forte expressão cultural baiana." },
                    { titulo: "Rodas de capoeira em praças", descricao: "Tradição social presente em todo o estado da Bahia." },
                    { titulo: "Celebrações do candomblé", descricao: "Importante manifestação religiosa e cultural na Bahia." }
                ],
                cultura: [
                    { titulo: "Pelourinho", descricao: "Principal centro histórico do estado da Bahia." },
                    { titulo: "Capoeira", descricao: "Uma das maiores expressões culturais baianas." },
                    { titulo: "Blocos afros", descricao: "Elementos marcantes do carnaval baiano." },
                    { titulo: "Candomblé", descricao: "Importante tradição religiosa da Bahia." },
                    { titulo: "Samba de roda", descricao: "Patrimônio Cultural da Humanidade na Bahia." },
                    { titulo: "Acarajé", descricao: "Símbolo da culinária e cultura baiana." },
                    { titulo: "Trio elétrico", descricao: "Marca do carnaval de Salvador." },
                    { titulo: "Festas de largo", descricao: "Fortemente presentes na cultura local da Bahia." },
                    { titulo: "Influência africana", descricao: "Muito visível na música, religião e culinária baiana." },
                    { titulo: "Artesanato baiano", descricao: "Grande diversidade de produtos artesanais." },
                    { titulo: "Música baiana", descricao: "Axé, samba-reggae e outros ritmos." },
                    { titulo: "Centro Histórico de Salvador", descricao: "Um dos mais importantes centros históricos do Brasil." }
                ]
            },
            ceara: {
                girias: [
                    { palavra: "Abirobado", significado: "Doido, maluco, sem juízo", exemplo: "Pare com isso, rapaz. Está abirobado, é?" },
                    { palavra: "Ariado", significado: "Pessoa perdida, desnorteada, sem rumo", exemplo: "Ih, aquele menino ali é ariado." },
                    { palavra: "Arriégua (arre-égua)", significado: "Expressão de surpresa ou espanto", exemplo: "Arriégua, mas que é isso? Arriégua, to muito feliz de te ver." },
                    { palavra: "Baixa da égua", significado: "Lugar distante, usado para mandar alguém para longe", exemplo: "Ah, mas vá para a baixa da égua e me deixa em paz." },
                    { palavra: "Botar boneco", significado: "Perturbar os outros, fazer brincadeiras", exemplo: "João bebeu demais e está botando boneco aqui na festa." },
                    { palavra: "Cambito", significado: "Perna fina", exemplo: "Olha os cambitinhos desse menino, parece que nem come." },
                    { palavra: "Cuida", significado: "Chamar a atenção de alguém sobre alguma situação", exemplo: "Ô, menino, assim vai derrubar suco na roupa. Cuida!" },
                    { palavra: "Diabeisso", significado: "Expressão de estranhamento ou dúvida", exemplo: "Diabeisso que você fez no seu cabelo?" },
                    { palavra: "Ispilicute", significado: "Garota bonitinha, desinibida ou levada", exemplo: "A Joana é ispilicute." },
                    { palavra: "Fumar uma quenga", significado: "Estar com muita raiva", exemplo: "Melhor nem falar com ela. A mulher está fumando uma quenga hoje." }
                ],
                costumes: [
                    { titulo: "Humor popular cearense", descricao: "Valorização da comédia e das piadas típicas do Ceará." },
                    { titulo: "Forró pé de serra", descricao: "Música tradicional muito presente no estado do Ceará." },
                    { titulo: "Rodas de violão nas calçadas", descricao: "Confraternização entre amigos e vizinhos no Ceará." },
                    { titulo: "Consumo de baião de dois", descricao: "Prato típico da culinária cearense." },
                    { titulo: "Renda de bilro", descricao: "Artesanato tradicional muito valorizado no Ceará." },
                    { titulo: "Praia aos fins de semana", descricao: "Forte hábito cultural dos cearenses." },
                    { titulo: "Festas de São João", descricao: "Muito populares em todo o estado do Ceará." },
                    { titulo: "Mercados públicos movimentados", descricao: "Centros de convivência e comércio no Ceará." },
                    { titulo: "Pesca de jangada", descricao: "Símbolo cultural cearense tradicional." },
                    { titulo: "Serestas noturnas", descricao: "Apresentações musicais tradicionais no Ceará." },
                    { titulo: "Uso de expressões regionais marcantes", descricao: "Linguagem característica do povo cearense." }
                ],
                cultura: [
                    { titulo: "Centro Dragão do Mar", descricao: "Referência cultural cearense." },
                    { titulo: "Jangadeiros", descricao: "Símbolo da cultura marítima do Ceará." },
                    { titulo: "Humor cearense", descricao: "Reconhecido nacionalmente." },
                    { titulo: "Praias e falésias", descricao: "Elementos marcantes da identidade local cearense." },
                    { titulo: "Literatura popular", descricao: "Cordel muito valorizado no Ceará." },
                    { titulo: "Rendeiras", descricao: "Importante tradição artesanal do Ceará." },
                    { titulo: "Cultura sertaneja", descricao: "Forte influência no interior do Ceará." },
                    { titulo: "Museus culturais de Fortaleza", descricao: "Preservação da história local." },
                    { titulo: "Música forrozeira", descricao: "Parte essencial da identidade do estado do Ceará." },
                    { titulo: "Artesanato em couro", descricao: "Muito difundido no Ceará." },
                    { titulo: "Feiras culturais", descricao: "Espaços de expressão artística no Ceará." }
                ]
            },
            maranhao: {
                girias: [
                    { palavra: "Armaria", significado: "Forma de dizer 'Ave Maria', expressão de espanto ou surpresa", exemplo: "Armaria, mas precisava disso tudo, é?" },
                    { palavra: "Égua", significado: "Expressão para dar ênfase a um sentimento", exemplo: "Égua, o que você está fazendo aqui? Égua, esse sapato está apertando meu pé." },
                    { palavra: "Esparroso", significado: "Algo que chama muita atenção", exemplo: "Olha a roupa daquela menina ali, toda esparrosa." },
                    { palavra: "Kiu!", significado: "Usado para zombar de alguém ou expressar alegria", exemplo: "Ó o menino caindo ali na rua, kiiiu." },
                    { palavra: "Parêa", significado: "Limites, 'não ter parêa' é não ter jeito", exemplo: "Mas você não tem parêa mesmo, hein?" },
                    { palavra: "Ralado", significado: "Ruim, chato, sem graça", exemplo: "Aquela festa de ontem foi ralada, hein?" }
                ],
                costumes: [
                    { titulo: "Bumba Meu Boi", descricao: "Festa popular que mistura teatro, dança e música no Maranhão." },
                    { titulo: "Tambor de Crioula", descricao: "Dança afro-brasileira acompanhada por tambores no Maranhão." },
                    { titulo: "Festa do Divino Espírito Santo", descricao: "Celebração religiosa tradicional no Maranhão." },
                    { titulo: "Quebra do coco babaçu", descricao: "Atividade econômica e cultural importante no Maranhão." },
                    { titulo: "Consumo de arroz de cuxá", descricao: "Prato típico maranhense muito apreciado." },
                    { titulo: "Mutirões comunitários", descricao: "Trabalho coletivo entre vizinhos no Maranhão." },
                    { titulo: "Pesca artesanal", descricao: "Muito comum nas áreas litorâneas do Maranhão." },
                    { titulo: "Contação de lendas locais", descricao: "Como a da Serpente Encantada no Maranhão." },
                    { titulo: "Uso de redes para descanso", descricao: "Costume presente em muitas casas do Maranhão." },
                    { titulo: "Feiras livres semanais", descricao: "Espaço de comércio e convivência no Maranhão." },
                    { titulo: "Festejos juninos com sotaque maranhense", descricao: "Quadrilhas e grupos folclóricos do Maranhão." }
                ],
                cultura: [
                    { titulo: "Lençóis Maranhenses", descricao: "Principal símbolo natural e turístico do estado do Maranhão." },
                    { titulo: "Casa das Tulhas", descricao: "Mercado tradicional de produtos regionais do Maranhão." },
                    { titulo: "Reggae maranhense", descricao: "São Luís é conhecida como a 'Jamaica Brasileira'." },
                    { titulo: "Azulejos portugueses", descricao: "Marca da arquitetura do centro histórico de São Luís." },
                    { titulo: "Lenda da Serpente Encantada", descricao: "Uma das histórias mais famosas do folclore maranhense." },
                    { titulo: "Centro Histórico de São Luís", descricao: "Patrimônio Mundial da UNESCO no Maranhão." },
                    { titulo: "Culinária baseada em frutos do mar", descricao: "Muito presente na costa maranhense." },
                    { titulo: "Matracas do Bumba Meu Boi", descricao: "Instrumentos característicos da festa maranhense." },
                    { titulo: "Comunidades quilombolas", descricao: "Forte presença cultural no Maranhão." },
                    { titulo: "Influência indígena na culinária", descricao: "Principalmente no uso da mandioca no Maranhão." },
                    { titulo: "Festas populares de rua", descricao: "Grande participação comunitária no Maranhão." }
                ]
            },
            paraiba: {
                girias: [
                    { palavra: "Abuso", significado: "Pegar ranço, enjoar, ficar sem paciência", exemplo: "Comi tanto morango que tomei abuso. Não conte a ninguém, mas tomei um abuso de Fernando." },
                    { palavra: "Apombaiado", significado: "Pessoa distraída, que nunca entende nada", exemplo: "Mas, gente, como você é apombaiado." },
                    { palavra: "Avexada", significado: "Pessoa apressada, impaciente", exemplo: "Ôxe, menina, deixe de ser avexada." },
                    { palavra: "Com a bexiga", significado: "Pessoa agitada ou irritada", exemplo: "Vá para lá que hoje eu tô com a bexiga." },
                    { palavra: "Ficar com a gota", significado: "Ficar com raiva, nervoso", exemplo: "To só a gota hoje." },
                    { palavra: "Fique peixe", significado: "Fique tranquilo", exemplo: "Amanhã tudo volta ao normal. Fique peixe!" },
                    { palavra: "Goitana", significado: "Expressão de surpresa ou para enfatizar algo", exemplo: "Eita goitana! Não sabia que você vinha! Que fome da goitana!" },
                    { palavra: "Mangar", significado: "Fazer graça com alguém", exemplo: "Ô, menino, pare de mangar do filho do vizinho." },
                    { palavra: "Peba", significado: "Coisa mal feita, ruim ou mixuruca", exemplo: "Que festinha peba, hein?" },
                    { palavra: "Só quer ser as pregas", significado: "Alguém que é metido, que se acha", exemplo: "Aquela menina só quer ser as pregas." }
                ],
                costumes: [
                    { titulo: "Maior São João do Mundo", descricao: "Forte tradição junina na Paraíba." },
                    { titulo: "Repentismo", descricao: "Improviso poético cantado muito valorizado na Paraíba." },
                    { titulo: "Literatura de cordel", descricao: "Leitura e venda em feiras populares na Paraíba." },
                    { titulo: "Consumo de rubacão", descricao: "Prato típico da culinária paraibana." },
                    { titulo: "Bandas de pífano", descricao: "Música tradicional presente em festas na Paraíba." },
                    { titulo: "Artesanato em couro", descricao: "Produção regional de grande valor na Paraíba." },
                    { titulo: "Vaquejadas", descricao: "Eventos culturais tradicionais na Paraíba." },
                    { titulo: "Procissões religiosas", descricao: "Muito comuns no calendário local da Paraíba." },
                    { titulo: "Feiras de artesanato", descricao: "Importantes para a economia local da Paraíba." },
                    { titulo: "Rodas de conversa nas calçadas", descricao: "Costume social muito presente na Paraíba." },
                    { titulo: "Apresentações de coco de roda", descricao: "Dança popular tradicional na Paraíba." }
                ],
                cultura: [
                    { titulo: "Centro Histórico de João Pessoa", descricao: "Patrimônio arquitetônico da Paraíba." },
                    { titulo: "Ponto mais oriental das Américas", descricao: "Marco cultural e turístico da Paraíba." },
                    { titulo: "Literatura de cordel", descricao: "Grande tradição local na Paraíba." },
                    { titulo: "Repentistas", descricao: "Destaque na cultura popular da Paraíba." },
                    { titulo: "Arte popular paraibana", descricao: "Reconhecida nacionalmente." },
                    { titulo: "Museu de Arte Popular", descricao: "Importante espaço cultural da Paraíba." },
                    { titulo: "Cultura do algodão", descricao: "Influenciou a história econômica da Paraíba." },
                    { titulo: "Bandas de pífano", descricao: "Elemento tradicional da música local paraibana." },
                    { titulo: "Folguedos populares", descricao: "Muito presentes nas festas da Paraíba." },
                    { titulo: "Artesanato em barro", descricao: "Produção tradicional da Paraíba." },
                    { titulo: "Patrimônio histórico de Areia", descricao: "Cidade de relevância cultural na Paraíba." }
                ]
            },
            pernambuco: {
                girias: [
                    { palavra: "Alma sebosa", significado: "Pessoa ruim, criminosa", exemplo: "Estou sem celular, um alma sebosa me assaltou semana passada." },
                    { palavra: "Caça-rato", significado: "Mulher que se envolve com homens que não prestam", exemplo: "Julinha é caça-rato, nunca vai atrás de alguém que preste." },
                    { palavra: "Dispense", significado: "Modo de mandar os outros pararem, 'deixa disso'", exemplo: "Você não para de falar, vê se dispense." },
                    { palavra: "Estilar", significado: "Usada quando você não gosta ou não concorda com algo", exemplo: "Ih, melhor parar que aquele lá estilou." },
                    { palavra: "Mancoso", significado: "Pessoa que vacila muito, que só faz besteira", exemplo: "Melhor não chamar ele, o cara é mancoso." },
                    { palavra: "Morgado", significado: "Desanimado, fraco", exemplo: "Aquela festa lá está morgada." },
                    { palavra: "Pala", significado: "Mentira, pessoa que mente muito é palosa", exemplo: "Isso é pala, menino. Não acredita, não." },
                    { palavra: "Tabacudo", significado: "Pessoa sem noção", exemplo: "Deixa de ser tabacudo." },
                    { palavra: "Vou chegar", significado: "Modo de se despedir, dar 'tchau'", exemplo: "Ae, vou chegar que já está tarde." }
                ],
                costumes: [
                    { titulo: "Frevo", descricao: "Dança símbolo do estado de Pernambuco." },
                    { titulo: "Maracatu", descricao: "Manifestação cultural afro-brasileira de Pernambuco." },
                    { titulo: "Caboclinhos", descricao: "Grupo folclórico tradicional pernambucano." },
                    { titulo: "Carnaval de rua", descricao: "Forte participação popular nas ruas de Pernambuco." },
                    { titulo: "Bonecos gigantes", descricao: "Marca cultural pernambucana." },
                    { titulo: "Consumo de bolo de rolo", descricao: "Doce típico de Pernambuco." },
                    { titulo: "Ciranda", descricao: "Dança coletiva muito tradicional em Pernambuco." },
                    { titulo: "Literatura de cordel", descricao: "Muito difundida em todo o estado de Pernambuco." },
                    { titulo: "Feiras populares", descricao: "Espaços culturais e comerciais importantes em Pernambuco." },
                    { titulo: "Festas religiosas tradicionais", descricao: "Presentes em diversas cidades de Pernambuco." },
                    { titulo: "Encontros em mercados históricos", descricao: "Costume urbano muito presente em Pernambuco." }
                ],
                cultura: [
                    { titulo: "Frevo", descricao: "Patrimônio Cultural Imaterial da Humanidade em Pernambuco." },
                    { titulo: "Maracatu", descricao: "Símbolo da cultura afro-pernambucana." },
                    { titulo: "Recife Antigo", descricao: "Centro histórico e cultural de Pernambuco." },
                    { titulo: "Bonecos gigantes de Olinda", descricao: "Marca do carnaval local de Pernambuco." },
                    { titulo: "Movimento Manguebeat", descricao: "Importante movimento musical de Pernambuco." },
                    { titulo: "Instituto Ricardo Brennand", descricao: "Referência cultural em Pernambuco." },
                    { titulo: "Artesanato de Caruaru", descricao: "Famoso em todo o país." },
                    { titulo: "Música regional diversificada", descricao: "Frevo, coco, ciranda e maracatu em Pernambuco." },
                    { titulo: "Centro Histórico de Olinda", descricao: "Patrimônio Mundial em Pernambuco." },
                    { titulo: "Literatura popular", descricao: "Forte presença do cordel em Pernambuco." },
                    { titulo: "Feira de Caruaru", descricao: "Uma das maiores feiras populares do Brasil." }
                ]
            },
            piaui: {
                girias: [
                    { palavra: "Batoré", significado: "Homem pequeno e feio", exemplo: "Sério que você quer brigar comigo, seu batoré?" },
                    { palavra: "Bró", significado: "Época mais quente do ano (setembro a dezembro)", exemplo: "Odeio que meu aniversário seja no Bró" },
                    { palavra: "Caçar conversa", significado: "Arrumar briga, provocar", exemplo: "O menino está caçando conversa com o João." },
                    { palavra: "Fazer muganga", significado: "Fazer bagunça, palhaçada", exemplo: "Para de muganga pra cima de mulher dos outros, rapaz." },
                    { palavra: "Ficar bestando", significado: "Ficar à toa, de bobeira", exemplo: "Vem me ajudar! Vai ficar bestando o dia todo aí, é?" },
                    { palavra: "Fuleragem", significado: "Ficar de molecagem, brincadeira de mau gosto", exemplo: "Deixa de fuleragem!" },
                    { palavra: "Galalau", significado: "Homem muito alto", exemplo: "Seu pai é um galalau." },
                    { palavra: "Isturdia", significado: "Outro dia, uns dias atrás", exemplo: "Isturdia eu vi o Zé lá no bar." },
                    { palavra: "Moiado", significado: "Feio", exemplo: "O seu namorado é moiado que só, hein?" },
                    { palavra: "Pêia", significado: "Soco, murro", exemplo: "Você viu a pêia que o Marcos tomou?" },
                    { palavra: "Por riba", significado: "Por cima", exemplo: "Pra que correr tanto assim? Passa por riba logo." },
                    { palavra: "Quando é fé", significado: "De repente", exemplo: "Eu estava na praia e, quando é fé, meu namorado chegou." },
                    { palavra: "Rebolar no mato", significado: "Jogar fora", exemplo: "Aquele seu sapato está muito velho. Já passou da hora de rebolar ele no mato." },
                    { palavra: "Só o pau da placa", significado: "Estar muito bêbado", exemplo: "Caio estava só o pau da plana no final da festa ontem." }
                ],
                costumes: [
                    { titulo: "Vaquejadas", descricao: "Eventos ligados à cultura sertaneja do Piauí." },
                    { titulo: "Criação de caprinos", descricao: "Tradição econômica do interior do Piauí." },
                    { titulo: "Festas de padroeiro", descricao: "Fortes em pequenas cidades do Piauí." },
                    { titulo: "Consumo de paçoca piauiense", descricao: "Carne seca socada com farinha no Piauí." },
                    { titulo: "Uso da rede de dormir", descricao: "Muito difundido no estado do Piauí." },
                    { titulo: "Feiras agropecuárias", descricao: "Reúnem produtores rurais no Piauí." },
                    { titulo: "Artesanato em palha de carnaúba", descricao: "Produção tradicional importante no Piauí." },
                    { titulo: "Benzimentos populares", descricao: "Prática cultural e religiosa no Piauí." },
                    { titulo: "Forrós comunitários", descricao: "Bailes populares muito animados no Piauí." },
                    { titulo: "Pescaria nos rios locais", descricao: "Costume recreativo e econômico no Piauí." },
                    { titulo: "Reuniões em praças ao entardecer", descricao: "Hábito social muito comum no Piauí." }
                ],
                cultura: [
                    { titulo: "Parque Nacional da Serra da Capivara", descricao: "Maior patrimônio arqueológico do Brasil no Piauí." },
                    { titulo: "Arte rupestre", descricao: "Marca cultural do estado do Piauí." },
                    { titulo: "Carnaúba", descricao: "Conhecida como 'árvore da vida' no Piauí." },
                    { titulo: "Museus arqueológicos", descricao: "Importantes para a preservação histórica do Piauí." },
                    { titulo: "Culinária sertaneja", descricao: "Fortemente ligada ao semiárido do Piauí." },
                    { titulo: "Cultura vaqueira", descricao: "Presente em diversas cidades do Piauí." },
                    { titulo: "Produção artesanal de palha", descricao: "Tradição regional do Piauí." },
                    { titulo: "Comunidades rurais tradicionais", descricao: "Forte identidade cultural no Piauí." },
                    { titulo: "Folclore sertanejo", descricao: "Histórias e lendas locais do Piauí." },
                    { titulo: "Música nordestina tradicional", descricao: "Presença constante em festividades no Piauí." },
                    { titulo: "Patrimônio histórico de Oeiras", descricao: "Antiga capital do estado do Piauí." }
                ]
            },
            rn: {
                girias: [
                    { palavra: "Arengar", significado: "Brigar, arrumar confusão", exemplo: "Pare de arengar o dia todo com os outros." },
                    { palavra: "Buliçoso", significado: "Pessoa enxerida, que quer mexer em tudo", exemplo: "Você não pode ver nada que já coloca a mão, seu moleque buliçoso." },
                    { palavra: "Catimbó", significado: "Macumba", exemplo: "Bati meu pé de novo, deve ser gente fazendo catimbó pra mim." },
                    { palavra: "Cheiro", significado: "Forma carinho de mandar um beijo", exemplo: "Lúcia, a Marli mandou um cheiro para você." },
                    { palavra: "Galado", significado: "Engraçado, hilário", exemplo: "O Tuco é galado demais!" },
                    { palavra: "Môca", significado: "Pessoa que parece surda, que nunca escuta", exemplo: "Você está môca, é? Estou te chamando há um tempão." },
                    { palavra: "Moído", significado: "Confusão, situação embaraçosa ou briga", exemplo: "Parem de moído e vamos aproveitar a festa." },
                    { palavra: "Tampa", significado: "Pessoa muito boa no que faz, especialista", exemplo: "O Maurício é tampa no violão." }
                ],
                costumes: [
                    { titulo: "Festas dos Mártires de Cunhaú e Uruaçu", descricao: "Tradição religiosa muito importante no RN." },
                    { titulo: "Passeios em dunas", descricao: "Costume turístico e cultural no RN." },
                    { titulo: "Consumo de carne de sol", descricao: "Muito popular na culinária potiguar." },
                    { titulo: "Forró em praças públicas", descricao: "Especialmente no mês de junho no RN." },
                    { titulo: "Artesanato em areia colorida", descricao: "Produção típica do estado do RN." },
                    { titulo: "Pesca artesanal", descricao: "Presente em todo o litoral do RN." },
                    { titulo: "Festas de padroeiros", descricao: "Com procissões e quermesses no RN." },
                    { titulo: "Uso de redes nas varandas", descricao: "Costume doméstico muito presente no RN." },
                    { titulo: "Feiras de produtos regionais", descricao: "Tradição comercial importante no RN." },
                    { titulo: "Encontros familiares aos domingos", descricao: "Costume muito valorizado no RN." },
                    { titulo: "Quadrilhas juninas competitivas", descricao: "Muito tradicionais no estado do RN." }
                ],
                cultura: [
                    { titulo: "Forte dos Reis Magos", descricao: "Principal patrimônio histórico do Rio Grande do Norte." },
                    { titulo: "Dunas de Genipabu", descricao: "Ícone turístico estadual do RN." },
                    { titulo: "Cultura pesqueira", descricao: "Muito presente no litoral do RN." },
                    { titulo: "Renda de bilro", descricao: "Artesanato tradicional do RN." },
                    { titulo: "Festas religiosas populares", descricao: "Forte presença cultural no RN." },
                    { titulo: "Museus históricos de Natal", descricao: "Preservação da memória potiguar." },
                    { titulo: "Cultura sertaneja do Seridó", descricao: "Muito valorizada no RN." },
                    { titulo: "Produção de bordados", descricao: "Artesanato regional do RN." },
                    { titulo: "Folclore potiguar", descricao: "Rico em lendas e tradições no RN." },
                    { titulo: "Grupos de dança popular", descricao: "Importantes em festividades no RN." },
                    { titulo: "Influência indígena e portuguesa", descricao: "Base da identidade cultural do RN." }
                ]
            },
            sergipe: {
                girias: [
                    { palavra: "Abelhudar", significado: "Se intrometer na vida alheia", exemplo: "Chico, pare de abelhudar e volte para a sua mesa." },
                    { palavra: "Acoitar", significado: "Esconder, acolher ou proteger", exemplo: "Para de ficar acoitando seu filho assim." },
                    { palavra: "Afolozado", significado: "Algo estragado, danificado", exemplo: "Po, minha camisa está afolozada." },
                    { palavra: "Aperreado", significado: "Estar aborrecido, chateado", exemplo: "Estou aperreado com a vida hoje." },
                    { palavra: "A pulso (apuço)", significado: "Fazer algo contra sua vontade, a força", exemplo: "Minha mãe me manda para a escola a pulso todos os dias." },
                    { palavra: "Bexiguento", significado: "Alguém que não vale nada, não presta", exemplo: "Aquele menino é bexiguento demais." },
                    { palavra: "Cabrunco", significado: "Ofensa, pessoa ruim ou feia", exemplo: "Ô moleque cabrunco!" },
                    { palavra: "E foi, foi?", significado: "Expressão para confirmar uma dúvida, 'é mesmo?'", exemplo: "Levei um pé na bunda ontem. E foi, foi?" },
                    { palavra: "Punga", significado: "Pegar carona sem autorização", exemplo: "Cuidado na hora de pegar uma punga." },
                    { palavra: "Tabaréu", significado: "Pessoa tímida, matuto", exemplo: "Nem tente chamar o Luiz, aquele ali é um tabaréu." }
                ],
                costumes: [
                    { titulo: "Chegança", descricao: "Folguedo ligado à cultura marítima de Sergipe." },
                    { titulo: "Cacumbi", descricao: "Manifestação afro-brasileira tradicional de Sergipe." },
                    { titulo: "Consumo de caranguejo", descricao: "Muito comum no litoral sergipano." },
                    { titulo: "Festas de Reis", descricao: "Tradição religiosa muito presente em Sergipe." },
                    { titulo: "Quadrilhas juninas", descricao: "Muito populares em todo o estado de Sergipe." },
                    { titulo: "Artesanato em cerâmica", descricao: "Produção regional de grande valor em Sergipe." },
                    { titulo: "Feiras livres tradicionais", descricao: "Importantes para a população sergipana." },
                    { titulo: "Procissões religiosas", descricao: "Parte do calendário local de Sergipe." },
                    { titulo: "Pesca artesanal", descricao: "Atividade econômica relevante em Sergipe." },
                    { titulo: "Forró em espaços públicos", descricao: "Costume cultural muito presente em Sergipe." },
                    { titulo: "Reuniões familiares em datas festivas", descricao: "Muito valorizadas em Sergipe." }
                ],
                cultura: [
                    { titulo: "Cânion do Xingó", descricao: "Grande referência turística e cultural de Sergipe." },
                    { titulo: "Chegança", descricao: "Folguedo típico sergipano." },
                    { titulo: "Cacumbi", descricao: "Manifestação cultural afro-brasileira de Sergipe." },
                    { titulo: "Artesanato em cerâmica", descricao: "Produção tradicional de Sergipe." },
                    { titulo: "Centro Histórico de São Cristóvão", descricao: "Patrimônio Mundial em Sergipe." },
                    { titulo: "Cultura ribeirinha", descricao: "Ligada ao Rio São Francisco em Sergipe." },
                    { titulo: "Museus culturais", descricao: "Importantes para a preservação histórica de Sergipe." },
                    { titulo: "Folclore regional", descricao: "Rico em tradições populares em Sergipe." },
                    { titulo: "Produção artesanal de bordados", descricao: "Destaque econômico e cultural de Sergipe." },
                    { titulo: "Festas religiosas tradicionais", descricao: "Muito presentes em Sergipe." },
                    { titulo: "Influência indígena e africana", descricao: "Base da identidade cultural de Sergipe." }
                ]
            }
        };

        const dadosGerais = {
            girias: [
                { palavra: "Abestado/Abestalhado", significado: "Chamar alguém de bobo, trouxa, tonto", exemplo: "O que o abestado do meu irmão foi fazer na sua casa ontem?" },
                { palavra: "Afeiçoado", significado: "Elogio sobre a aparência de alguém, bonito ou bem arrumado", exemplo: "O Alexandre é um rapaz bem afeiçoado, não é?" },
                { palavra: "Afolozado", significado: "Algo estragado, que não dá mais para usar", exemplo: "Esta minha camisa está afolozada." },
                { palavra: "Ai dento", significado: "Sai fora, vai se danar", exemplo: "Fiquei sabendo que você ficou de rolo com a Maria. Ai dento, nem pensar." },
                { palavra: "Aluado", significado: "Quem fica no mundo da lua, que faz muita besteira", exemplo: "Você falou aquilo mesmo com ela? É aluado, é?" },
                { palavra: "Amancebado", significado: "Viver junto sem ser casado oficialmente, amigado", exemplo: "Tire o cavalinho da chuva, Fernando. Essa aí é amancebada." },
                { palavra: "Aperreado", significado: "Estar aborrecido, chateado", exemplo: "Estou aperreado com a vida hoje." },
                { palavra: "Apombaiado", significado: "Pessoa distraída, que nunca entende nada", exemplo: "Mas, gente, como você é apombaiado." },
                { palavra: "A pulso (apuço)", significado: "Fazer algo contra sua vontade, a força", exemplo: "Minha mãe me manda para a escola a pulso todos os dias." },
                { palavra: "Apurrinhado", significado: "Estar com raiva, muito irritado", exemplo: "Não me venha de histórias que eu já estou apurrinhado contigo." },
                { palavra: "Arengar", significado: "Brigar, arrumar confusão", exemplo: "Pare de arengar o dia todo com os outros." },
                { palavra: "Armaria", significado: "Forma de dizer Ave Maria, expressão de espanto", exemplo: "Armaria, mas precisava disso tudo, é?" },
                { palavra: "Arretado", significado: "Muito bom, legal, bonito, corajoso, valente ou irritado", exemplo: "Luiz, esse teu tênis é arretado, hein? Olhe, nem chegue perto que hoje eu estou arretada." },
                { palavra: "Arribar", significado: "Ir embora, sair de algum lugar, levantar ou subir", exemplo: "Minha ex está chegando, vou arribar agora. Menino, arriba agora daí e vá tomar banho." },
                { palavra: "Arriégua (arre-égua)", significado: "Expressão de surpresa ou espanto", exemplo: "Arriégua, mas que é isso? Arriégua, to muito feliz de te ver." },
                { palavra: "Arrochar", significado: "Apertar algo com força", exemplo: "Mulher, arroche bem esses parafusos porque essa cama vai ser dos meninos." },
                { palavra: "Arrudiar", significado: "Dar a volta, rodear algo ou alguém", exemplo: "André, você vai me deixar tonta! Para de me arrudiar." },
                { palavra: "Avalie", significado: "Imagine", exemplo: "Avalie o tamanho do problema quando o meu chefe descobrir." },
                { palavra: "Avexada", significado: "Pessoa apressada, impaciente", exemplo: "Ôxe, menina, deixe de ser avexada." },
                { palavra: "Bagaceira", significado: "Festa animada, farra, bagunça", exemplo: "Ninguém me segura que hoje eu vou cair na bagaceira!" },
                { palavra: "Baixa da égua", significado: "Lugar distante, usado para mandar alguém para longe", exemplo: "Ah, mas vá para a baixa da égua e me deixa em paz." },
                { palavra: "Barreado", significado: "Confuso, perdido, sem saber o que fazer", exemplo: "Ontem perdi a hora e acordei até barreado." },
                { palavra: "Basculho", significado: "Resto, sobra, algo que se vai jogar fora", exemplo: "Eu não vim do lixo para perder para basculho." },
                { palavra: "Bater fofo", significado: "Vacilar com alguém, dar uma mancada", exemplo: "O Carlos bateu fofo ontem. Combinou de sair e desapareceu." },
                { palavra: "Batoré", significado: "Homem pequeno e feio", exemplo: "Sério que você quer brigar comigo, seu batoré?" },
                { palavra: "Bestar", significado: "Ficar à toa, de bobeira", exemplo: "Vem me ajudar! Vai ficar bestando o dia todo aí, é?" },
                { palavra: "Bexiguento", significado: "Alguém que não vale nada, não presta", exemplo: "Aquele menino é bexiguento demais." },
                { palavra: "Bichinho", significado: "Forma carinhosa de chamar alguém", exemplo: "Ei, bichinho, venha aqui me dar um abraço. Tadinho do bichinho, não merecia isso." },
                { palavra: "Botar boneco", significado: "Perturbar os outros, fazer brincadeiras", exemplo: "João bebeu demais e está botando boneco aqui na festa." },
                { palavra: "Brechar", significado: "Espionar, dar aquela espiada", exemplo: "O vizinho tem mania de brechar aqui dentro de casa." },
                { palavra: "Buliçoso", significado: "Pessoa enxerida, que quer mexer em tudo", exemplo: "Você não pode ver nada que já coloca a mão, seu moleque buliçoso." },
                { palavra: "Cabra", significado: "Pessoa, sujeito, indivíduo, homem", exemplo: "Não vou com a cara do Zé. Ô, cabra safado." },
                { palavra: "Cabrunco", significado: "Ofensa, pessoa ruim ou feia", exemplo: "Ô moleque cabrunco!" },
                { palavra: "Cabueta", significado: "Pessoa que entrega outra, dedo-duro", exemplo: "O Chico é um cabueta. Contou para professora que eu colei dele." },
                { palavra: "Caçar conversa", significado: "Arrumar briga, provocar", exemplo: "O menino está caçando conversa com o João." },
                { palavra: "Cacunda", significado: "Ombro, parte de cima das costas", exemplo: "Vem filho, sobe aqui na cacunda do pai." },
                { palavra: "Cambito", significado: "Perna fina", exemplo: "Olha os cambitinhos desse menino, parece que nem come." },
                { palavra: "Cangote", significado: "Pescoço", exemplo: "Hum, que perfume bom! Posso cheirar o seu cangote?" },
                { palavra: "Caningado", significado: "Alguém que é ou está sendo chato ou irritante", exemplo: "O Paulo não para de falar. Ô, cabra caningado." },
                { palavra: "Carão", significado: "Bronca, chamada de atenção", exemplo: "A Marta levou um carão da diretora da escola." },
                { palavra: "Carecer", significado: "Precisar, necessitar", exemplo: "Sônia, você está carecendo de um descanso." },
                { palavra: "Cheiro", significado: "Forma carinho de mandar um beijo", exemplo: "Lúcia, a Marli mandou um cheiro para você." },
                { palavra: "Da bexiga", significado: "Dar intensidade ao que é falado, muito ou demais", exemplo: "Mulher, eu estou com uma fome da bexiga! Credo, hoje está um calor da bexiga!" },
                { palavra: "Dar fé", significado: "Perceber, notar, reparar em algo ou alguém", exemplo: "Acredita que só hoje dei fé que seus olhos são claros?" },
                { palavra: "Danou-se", significado: "Expressa espanto, susto ou entusiasmo, ou que alguém se deu mal", exemplo: "Perdi a hora hoje. Danou-se! O Manel caiu da moto e danou-se todo ontem." },
                { palavra: "Dar uma carreira", significado: "Correr", exemplo: "Vou dar uma carreira, senão perco a condução." },
                { palavra: "Descabriado", significado: "Desconfiado, desanimado, tristonho", exemplo: "O Felipe ficou descabriado depois da conversa de ontem." },
                { palavra: "Descorado", significado: "Perdeu a cor, pálido", exemplo: "Maria, você está passando bem? Ficou descorada do nada!" },
                { palavra: "Desembestado", significado: "Desorientado, sem rumo, ou apressado", exemplo: "Rapaz, onde você vai desembestado desse jeito?" },
                { palavra: "Diabeisso", significado: "Expressão de estranhamento ou dúvida", exemplo: "Diabeisso que você fez no seu cabelo?" },
                { palavra: "Distrenado", significado: "Tímido, sem graça ou envergonhado", exemplo: "A Zefa ficou distrenada com o elogio do Eduardo, né?" },
                { palavra: "Eita pega", significado: "Expressar espanto ou surpresa", exemplo: "Eita pega, não tinha visto que você tava aqui!" },
                { palavra: "Emburacar", significado: "Entrar em um lugar de uma vez, sem pedir licença", exemplo: "Emburaquei na festa, mesmo sem convite." },
                { palavra: "Emperiquitado", significado: "Algo ou alguém muito arrumado", exemplo: "Tonho, onde você vai emperiquitado assim?" },
                { palavra: "Enfadado", significado: "Cansado, desanimado e até triste", exemplo: "Ai, já estou enfadado de ficar aqui sentado." },
                { palavra: "Engomar", significado: "Passar roupa a ferro", exemplo: "Mãe, pode engomar a minha blusa, por favor?" },
                { palavra: "Escarafunchar", significado: "Mexer, revirar, fuxicar algo", exemplo: "Pare de escarafunchar esse pé. Aquele ali adora escarafunchar o podre dos outros." },
                { palavra: "Estopô", significado: "Pessoa chata, inconveniente, irritante", exemplo: "Ai, o Paulo é um estopô" },
                { palavra: "Estribado", significado: "Pessoa rica, com muita grana", exemplo: "Aquele lá ficou estribado e nunca mais falou com a gente." },
                { palavra: "Falar nome", significado: "Falar palavrão, xingar", exemplo: "Que boca suja, menino! Pare de falar nome!" },
                { palavra: "Farda", significado: "Uniforme escolar", exemplo: "Camila, não acredito que vai sair com a farda toda amassada." },
                { palavra: "Fazer munganga", significado: "Fazer bagunça, palhaçada", exemplo: "Para de munganga pra cima de mulher dos outros, rapaz. O menino não para com essa muganga de estalar os dedos." },
                { palavra: "Ficar com a gota", significado: "Ficar com raiva, nervoso", exemplo: "To só a gota hoje." },
                { palavra: "Filho da gota serena/Filho da bexiga", significado: "Pessoa ou coisa considerada ruim", exemplo: "Cuidado com aquele ali, hein? É o filho da gota serena. Sai para lá, seu filho da bexiga" },
                { palavra: "Findar", significado: "Terminar, encerrar, acabar", exemplo: "Ô ano demorado para findar." },
                { palavra: "Filar", significado: "Trapacear em uma prova, colar", exemplo: "A Joana tirou zero porque filou na prova." },
                { palavra: "Folote", significado: "Algo largo, frouxo, folgado", exemplo: "Fernanda, você emagreceu? Sua bermuda está folote." },
                { palavra: "Frescar", significado: "Brincar, tirar sarro sem maldade", exemplo: "Você acreditou que o Bruno vai embora? Ele tava frescando!" },
                { palavra: "Fuleragem", significado: "Molecagem, brincadeira de mau gosto", exemplo: "Deixa de fuleragem! Esse tênis aqui é fuleragem..." },
                { palavra: "Gaia", significado: "Levar um chifre, ser traído", exemplo: "Soube da Gaia que o Cláudio levou?" },
                { palavra: "Gaitar", significado: "Rir alto, gargalhar", exemplo: "Para com isso, estou gaitando aqui!" },
                { palavra: "Galalau", significado: "Homem muito alto", exemplo: "Seu pai é um galalau." },
                { palavra: "Galego", significado: "Pessoa loira e muito branca", exemplo: "O filho da Dani nasceu galeguinho." },
                { palavra: "Gastura", significado: "Sensação de desconforto, incômodo e irritação", exemplo: "O professor Roberto me dá uma gastura." },
                { palavra: "Gazear", significado: "Faltar à escola ou trabalho de propósito", exemplo: "Vamos gazear a aula amanhã na praia?" },
                { palavra: "Guaribada", significado: "Arrumar algo com atenção, dar uma caprichada", exemplo: "Vou levar meu carro no Marquinhos para ele dar uma guaribada." },
                { palavra: "Inhaca", significado: "Cheiro forte de suor", exemplo: "Rapaz, chegue para lá que estou sentindo a tua inhaca daqui." },
                { palavra: "Inteirado", significado: "Estar bem informado sobre algo", exemplo: "Daniel, você está inteirado sobre a situação política do país?" },
                { palavra: "Istruir (estruir)", significado: "Desperdiçar algo", exemplo: "Gabi, coma tudo para não istruir." },
                { palavra: "Jabá", significado: "Carne-seca, charque", exemplo: "O almoço hoje vai ser carne de jabá." },
                { palavra: "Lambança", significado: "Sujeira, bagunça", exemplo: "Mas que lambança que você fez aqui, homem!" },
                { palavra: "Lascado", significado: "Cheio de problemas ou em situação complicada", exemplo: "O Brasil está lascado. Lascou! Maínha descobriu que eu tirei zero na prova de matemática." },
                { palavra: "Lavar a égua", significado: "Levar vantagem, estar com sorte", exemplo: "Se eu ganhar na loteria hoje, vou lavar a égua!" },
                { palavra: "Lenga-lenga", significado: "Conversa fiada, enrolação", exemplo: "Lá vem a Isabel com aquela lenga-lenga de novo. Pare de lenga-lenga e peça logo a Bia em namoro." },
                { palavra: "Leriado", significado: "Conversa fiada, papo para enganar os outros", exemplo: "Ah, Jorge, para que eu conheço esse teu leriado." },
                { palavra: "Leseira", significado: "Preguiça, desânimo, moleza", exemplo: "Depois de almoçar sempre me bate uma leseira." },
                { palavra: "Lonjura", significado: "Distância muito grande, lugar longe", exemplo: "Laura, não sei se vou na festa hoje. É uma lonjura!" },
                { palavra: "Machucar", significado: "Esmagar, amassar ou triturar algo", exemplo: "Comprei essa manga e não vi que estava toda machucada." },
                { palavra: "Magoar", significado: "Se ferir, se machucar", exemplo: "Magoei meu dedo jogando vôlei ontem." },
                { palavra: "Maínha", significado: "Forma carinhosa de chamar a mãe", exemplo: "Estou com uma saudade de maínha. Maínha, o que tem para o almoço hoje?" },
                { palavra: "Maldar", significado: "Interpretar mal, entender de forma negativa", exemplo: "Eu e o Mário somos só amigos. Não vá maldar, hein?" },
                { palavra: "Maluvido", significado: "Pessoa teimosa, desobediente, mal educada", exemplo: "Nádia, deixe de ser maluvida e me obedeça agora." },
                { palavra: "Mangar", significado: "Fazer graça com alguém", exemplo: "Ô, menino, pare de mangar do filho do vizinho." },
                { palavra: "Massa", significado: "Algo legal, divertido, bonito", exemplo: "A festa ontem foi muito massa! O Juninho é massa mesmo, né?" },
                { palavra: "Migué", significado: "Enrolar, tentar convencer alguém", exemplo: "Você disse que ia aparecer ontem e depois deu um migué." },
                { palavra: "Miolo de pote", significado: "Algo irrelevante, sem importância", exemplo: "Pare de falar miolo de pote e vá trabalhar." },
                { palavra: "Morgado", significado: "Desanimado, fraco", exemplo: "Aquela festa lá está morgada." },
                { palavra: "Munganga", significado: "Careta ou brincadeira", exemplo: "Pare de fazer munganga e entre logo em casa." },
                { palavra: "Muriçoca", significado: "Mosquito ou pernilongo", exemplo: "Essa noite uma muriçoca me picou todo." },
                { palavra: "Não vale o que o gato enterra", significado: "Alguém que não vale nada", exemplo: "O Otávio não vale o que o gato enterra." },
                { palavra: "Nem xite", significado: "Não se importar, nem ligar", exemplo: "A Simone me fez várias perguntas e eu nem xite." },
                { palavra: "Nera?", significado: "Não era?, usado para confirmar algo", exemplo: "Marco era professor de História, nera?" },
                { palavra: "Ôxe", significado: "Expressão de surpresa, espanto, dúvida ou indignação", exemplo: "Ôxe, que bom que você veio. Ôxe, por que você está nervosa assim?" },
                { palavra: "Pai d'égua", significado: "Algo ótimo, incrível, maravilhoso", exemplo: "O almoço ontem foi pai d'égua." },
                { palavra: "Paínho", significado: "Forma carinho de chamar o pai", exemplo: "Paínho tem um coração enorme." },
                { palavra: "Pala", significado: "Mentira, pessoa que mente muito é palosa", exemplo: "Isso é pala, menino. Não acredita, não." },
                { palavra: "Para o ano", significado: "No ano seguinte", exemplo: "O casamento da Marisa é só para o ano." },
                { palavra: "Peba", significado: "Algo de qualidade ruim, vagabundo", exemplo: "Esse meu celular é muito peba." },
                { palavra: "Pegar ar", significado: "Se irritar, ficar muito brabo", exemplo: "Peguei ar ontem naquele engarrafamento." },
                { palavra: "Pegar o beco", significado: "Sair imediatamente de algum lugar", exemplo: "O papo está bom, mas vou pegar o beco. Pegue o beco e não volte mais!" },
                { palavra: "Peguento", significado: "Algo pegajoso, grudento", exemplo: "Não lavaram essa panela direito. Está toda peguenta." },
                { palavra: "Pêia", significado: "Soco, murro", exemplo: "Você viu a pêia que o Marcos tomou?" },
                { palavra: "Pinote", significado: "Saltar de forma desengonçada, dar um pulo de susto", exemplo: "A Mari deu um pinote quando viu o meu gato." },
                { palavra: "Pisa", significado: "Surra", exemplo: "Estou todo dolorido, parece que levei uma pisa." },
                { palavra: "Pirangueiro", significado: "Mão de vaca, pão duro, ou malandro no Ceará", exemplo: "Deixa de ser pirangueiro e me paga um suco, homem. O bar hoje está cheio de pirangueiro, hein?" },
                { palavra: "Pomba lesa", significado: "Pessoa lerda, de raciocínio lento", exemplo: "Mas a Carla é uma pomba lesa mesmo, hein?" },
                { palavra: "Por riba", significado: "Por cima", exemplo: "Para que correr tanto assim? Passa por riba logo." },
                { palavra: "Quartos", significado: "Quadris", exemplo: "Acordei com uma dor nos quartos hoje." },
                { palavra: "Quengo", significado: "Cabeça", exemplo: "Mulher, bati com o quengo na porta ontem." },
                { palavra: "Quentura", significado: "Muito calor", exemplo: "Só de andar daqui até ali já sobe uma quentura." },
                { palavra: "Racha", significado: "Futebol informal, pelada", exemplo: "Amanhã tem um racha no campinho da rua de baixo." },
                { palavra: "Rafamé", significado: "Algo ou alguém que não vale nada", exemplo: "Não confia que aquele ali é rafamé. Nossa, este material é muito rafamé." },
                { palavra: "Rebolar no mato", significado: "Jogar fora", exemplo: "Aquele seu sapato está muito velho. Já passou da hora de rebolar ele no mato." },
                { palavra: "Relar", significado: "Encostar, tocar de leve", exemplo: "Quase relei o carro no muro ontem." },
                { palavra: "Respeite", significado: "Demonstrar que algo é muito bom", exemplo: "Respeite essa farofa, que está boa demais!" },
                { palavra: "Rochedo", significado: "Algo muito legal, muito maneiro", exemplo: "Po, aquele show foi rochedo!" },
                { palavra: "Saliente", significado: "Pessoa exibida, que gosta de aparecer", exemplo: "Eita, Paulo, deixe de ser saliente." },
                { palavra: "Salseiro", significado: "Confusão, bagunça e desordem", exemplo: "Mas minha gente, que salseiro é esse aqui?" },
                { palavra: "Se aviar", significado: "Se apressar, ir rápido", exemplo: "É melhor se aviar para não chegar atrasado na escola." },
                { palavra: "Seboso", significado: "Algo muito sujo, nojento, porco", exemplo: "Maria, esse prato aqui está todo seboso." },
                { palavra: "Sibito baleado/Sibite baleado", significado: "Pessoa muito magra ou com pernas finas", exemplo: "Homem, coma bem ou vai ficar só o sibito baleado." },
                { palavra: "Só quer ser as pregas", significado: "Alguém que é metido, que se acha", exemplo: "Aquela menina só quer ser as pregas." },
                { palavra: "Tabacudo", significado: "Pessoa sem noção", exemplo: "Deixa de ser tabacudo." },
                { palavra: "Tá com a bexiga lixa", significado: "Pessoa extremamente agitada, descontrolada", exemplo: "O que houve com o César? Ele tá com a bexiga lixa hoje." },
                { palavra: "Tibungar", significado: "Mergulhar, dar um 'tibum'", exemplo: "Que vontade de tibungar no rio com esse calor." },
                { palavra: "Torar", significado: "Quebrar, cortar ou partir", exemplo: "Tem tanta roupa que daqui a pouco o varal vai torar." },
                { palavra: "Triscar", significado: "Encostar, raspar, tirar uma lasquinha", exemplo: "Posso triscar um pouquinha da sua carne?" },
                { palavra: "Varapau", significado: "Pessoa muito magra e alta", exemplo: "A Alessandra está um varapau, não é?" },
                { palavra: "Venta", significado: "Nariz", exemplo: "Olha o tamanho da venta desse menino!" },
                { palavra: "Visagem", significado: "Assombração ou alma penada", exemplo: "Eu morro de medo de visagem!" },
                { palavra: "Vôte", significado: "Expressão de espanto, surpresa ou susto", exemplo: "Vôte! Achei que era uma visagem." },
                { palavra: "Xexeiro", significado: "Pessoa que não paga o que deve, caloteiro", exemplo: "Não venda nada para o Flávio, ele é um xexeiro." },
                { palavra: "Ximar", significado: "Olhar para o prato de outra pessoa, cobiçando a comida", exemplo: "Pare de ximar, Tonho! Me deixe comer em paz." },
                { palavra: "Zoada", significado: "Barulho irritante, gritaria, zumbido", exemplo: "Não aguento mais essa zoada todo final de semana." }
            ],
            costumes: [
                { titulo: "Guerreiro alagoano", descricao: "Folguedo popular tradicional de Alagoas." },
                { titulo: "Pastoril", descricao: "Apresentação cultural natalina muito tradicional em Alagoas." },
                { titulo: "Consumo de sururu", descricao: "Prato típico alagoano, muito apreciado localmente." },
                { titulo: "Pesca em lagoas", descricao: "Atividade tradicional presente em todo o estado de Alagoas." },
                { titulo: "Artesanato com renda filé", descricao: "Patrimônio cultural alagoano de grande valor." },
                { titulo: "Festas de padroeiros", descricao: "Celebrações religiosas muito populares em Alagoas." },
                { titulo: "Quadrilhas juninas", descricao: "Parte importante das festas de São João em Alagoas." },
                { titulo: "Feiras de artesanato", descricao: "Tradição econômica e cultural importante em Alagoas." },
                { titulo: "Uso de embarcações tradicionais", descricao: "Nas lagoas, mantendo a tradição alagoana." },
                { titulo: "Mutirões comunitários", descricao: "Ajuda entre moradores em tarefas coletivas em Alagoas." },
                { titulo: "Serestas e apresentações musicais", descricao: "Eventos frequentes nas cidades alagoanas." },
                { titulo: "Lavagem do Bonfim", descricao: "Festa religiosa e cultural tradicional da Bahia." },
                { titulo: "Capoeira", descricao: "Expressão cultural afro-brasileira presente nas ruas da Bahia." },
                { titulo: "Acarajé nas ruas", descricao: "Tradição gastronômica baiana muito popular." },
                { titulo: "Samba de roda", descricao: "Patrimônio cultural da Bahia." },
                { titulo: "Festa de Iemanjá", descricao: "Celebração religiosa popular muito tradicional na Bahia." },
                { titulo: "Carnaval de trio elétrico", descricao: "Marca registrada da Bahia." },
                { titulo: "Uso de roupas brancas em festas religiosas", descricao: "Costume tradicional baiano." },
                { titulo: "Artesanato em fitas do Bonfim", descricao: "Símbolo cultural da Bahia." },
                { titulo: "Consumo de moqueca baiana", descricao: "Prato típico da culinária baiana." },
                { titulo: "Blocos afros", descricao: "Forte expressão cultural baiana." },
                { titulo: "Rodas de capoeira em praças", descricao: "Tradição social presente em todo o estado da Bahia." },
                { titulo: "Celebrações do candomblé", descricao: "Importante manifestação religiosa e cultural na Bahia." },
                { titulo: "Humor popular cearense", descricao: "Valorização da comédia e das piadas típicas do Ceará." },
                { titulo: "Forró pé de serra", descricao: "Música tradicional muito presente no estado do Ceará." },
                { titulo: "Rodas de violão nas calçadas", descricao: "Confraternização entre amigos e vizinhos no Ceará." },
                { titulo: "Consumo de baião de dois", descricao: "Prato típico da culinária cearense." },
                { titulo: "Renda de bilro", descricao: "Artesanato tradicional muito valorizado no Ceará." },
                { titulo: "Praia aos fins de semana", descricao: "Forte hábito cultural dos cearenses." },
                { titulo: "Festas de São João", descricao: "Muito populares em todo o estado do Ceará." },
                { titulo: "Mercados públicos movimentados", descricao: "Centros de convivência e comércio no Ceará." },
                { titulo: "Pesca de jangada", descricao: "Símbolo cultural cearense tradicional." },
                { titulo: "Serestas noturnas", descricao: "Apresentações musicais tradicionais no Ceará." },
                { titulo: "Uso de expressões regionais marcantes", descricao: "Linguagem característica do povo cearense." },
                { titulo: "Bumba Meu Boi", descricao: "Festa popular que mistura teatro, dança e música no Maranhão." },
                { titulo: "Tambor de Crioula", descricao: "Dança afro-brasileira acompanhada por tambores no Maranhão." },
                { titulo: "Festa do Divino Espírito Santo", descricao: "Celebração religiosa tradicional no Maranhão." },
                { titulo: "Quebra do coco babaçu", descricao: "Atividade econômica e cultural importante no Maranhão." },
                { titulo: "Consumo de arroz de cuxá", descricao: "Prato típico maranhense muito apreciado." },
                { titulo: "Mutirões comunitários", descricao: "Trabalho coletivo entre vizinhos no Maranhão." },
                { titulo: "Pesca artesanal", descricao: "Muito comum nas áreas litorâneas do Maranhão." },
                { titulo: "Contação de lendas locais", descricao: "Como a da Serpente Encantada no Maranhão." },
                { titulo: "Uso de redes para descanso", descricao: "Costume presente em muitas casas do Maranhão." },
                { titulo: "Feiras livres semanais", descricao: "Espaço de comércio e convivência no Maranhão." },
                { titulo: "Festejos juninos com sotaque maranhense", descricao: "Quadrilhas e grupos folclóricos do Maranhão." },
                { titulo: "Maior São João do Mundo", descricao: "Forte tradição junina na Paraíba." },
                { titulo: "Repentismo", descricao: "Improviso poético cantado muito valorizado na Paraíba." },
                { titulo: "Literatura de cordel", descricao: "Leitura e venda em feiras populares na Paraíba." },
                { titulo: "Consumo de rubacão", descricao: "Prato típico da culinária paraibana." },
                { titulo: "Bandas de pífano", descricao: "Música tradicional presente em festas na Paraíba." },
                { titulo: "Artesanato em couro", descricao: "Produção regional de grande valor na Paraíba." },
                { titulo: "Vaquejadas", descricao: "Eventos culturais tradicionais na Paraíba." },
                { titulo: "Procissões religiosas", descricao: "Muito comuns no calendário local da Paraíba." },
                { titulo: "Feiras de artesanato", descricao: "Importantes para a economia local da Paraíba." },
                { titulo: "Rodas de conversa nas calçadas", descricao: "Costume social muito presente na Paraíba." },
                { titulo: "Apresentações de coco de roda", descricao: "Dança popular tradicional na Paraíba." },
                { titulo: "Frevo", descricao: "Dança símbolo do estado de Pernambuco." },
                { titulo: "Maracatu", descricao: "Manifestação cultural afro-brasileira de Pernambuco." },
                { titulo: "Caboclinhos", descricao: "Grupo folclórico tradicional pernambucano." },
                { titulo: "Carnaval de rua", descricao: "Forte participação popular nas ruas de Pernambuco." },
                { titulo: "Bonecos gigantes", descricao: "Marca cultural pernambucana." },
                { titulo: "Consumo de bolo de rolo", descricao: "Doce típico de Pernambuco." },
                { titulo: "Ciranda", descricao: "Dança coletiva muito tradicional em Pernambuco." },
                { titulo: "Literatura de cordel", descricao: "Muito difundida em todo o estado de Pernambuco." },
                { titulo: "Feiras populares", descricao: "Espaços culturais e comerciais importantes em Pernambuco." },
                { titulo: "Festas religiosas tradicionais", descricao: "Presentes em diversas cidades de Pernambuco." },
                { titulo: "Encontros em mercados históricos", descricao: "Costume urbano muito presente em Pernambuco." },
                { titulo: "Vaquejadas", descricao: "Eventos ligados à cultura sertaneja do Piauí." },
                { titulo: "Criação de caprinos", descricao: "Tradição econômica do interior do Piauí." },
                { titulo: "Festas de padroeiro", descricao: "Fortes em pequenas cidades do Piauí." },
                { titulo: "Consumo de paçoca piauiense", descricao: "Carne seca socada com farinha no Piauí." },
                { titulo: "Uso da rede de dormir", descricao: "Muito difundido no estado do Piauí." },
                { titulo: "Feiras agropecuárias", descricao: "Reúnem produtores rurais no Piauí." },
                { titulo: "Artesanato em palha de carnaúba", descricao: "Produção tradicional importante no Piauí." },
                { titulo: "Benzimentos populares", descricao: "Prática cultural e religiosa no Piauí." },
                { titulo: "Forrós comunitários", descricao: "Bailes populares muito animados no Piauí." },
                { titulo: "Pescaria nos rios locais", descricao: "Costume recreativo e econômico no Piauí." },
                { titulo: "Reuniões em praças ao entardecer", descricao: "Hábito social muito comum no Piauí." },
                { titulo: "Festas dos Mártires de Cunhaú e Uruaçu", descricao: "Tradição religiosa muito importante no RN." },
                { titulo: "Passeios em dunas", descricao: "Costume turístico e cultural no RN." },
                { titulo: "Consumo de carne de sol", descricao: "Muito popular na culinária potiguar." },
                { titulo: "Forró em praças públicas", descricao: "Especialmente no mês de junho no RN." },
                { titulo: "Artesanato em areia colorida", descricao: "Produção típica do estado do RN." },
                { titulo: "Pesca artesanal", descricao: "Presente em todo o litoral do RN." },
                { titulo: "Festas de padroeiros", descricao: "Com procissões e quermesses no RN." },
                { titulo: "Uso de redes nas varandas", descricao: "Costume doméstico muito presente no RN." },
                { titulo: "Feiras de produtos regionais", descricao: "Tradição comercial importante no RN." },
                { titulo: "Encontros familiares aos domingos", descricao: "Costume muito valorizado no RN." },
                { titulo: "Quadrilhas juninas competitivas", descricao: "Muito tradicionais no estado do RN." },
                { titulo: "Chegança", descricao: "Folguedo ligado à cultura marítima de Sergipe." },
                { titulo: "Cacumbi", descricao: "Manifestação afro-brasileira tradicional de Sergipe." },
                { titulo: "Consumo de caranguejo", descricao: "Muito comum no litoral sergipano." },
                { titulo: "Festas de Reis", descricao: "Tradição religiosa muito presente em Sergipe." },
                { titulo: "Quadrilhas juninas", descricao: "Muito populares em todo o estado de Sergipe." },
                { titulo: "Artesanato em cerâmica", descricao: "Produção regional de grande valor em Sergipe." },
                { titulo: "Feiras livres tradicionais", descricao: "Importantes para a população sergipana." },
                { titulo: "Procissões religiosas", descricao: "Parte do calendário local de Sergipe." },
                { titulo: "Pesca artesanal", descricao: "Atividade econômica relevante em Sergipe." },
                { titulo: "Forró em espaços públicos", descricao: "Costume cultural muito presente em Sergipe." },
                { titulo: "Reuniões familiares em datas festivas", descricao: "Muito valorizadas em Sergipe." }
            ],
            cultura: [
                { titulo: "Renda Filé", descricao: "Principal símbolo artesanal do estado de Alagoas." },
                { titulo: "Lagoas e canais", descricao: "Elementos centrais da identidade local alagoana." },
                { titulo: "Cultura dos pescadores", descricao: "Muito presente no litoral alagoano." },
                { titulo: "Quilombo dos Palmares", descricao: "Marco histórico nacional em Alagoas." },
                { titulo: "Artesanato tradicional", descricao: "Grande diversidade de técnicas em Alagoas." },
                { titulo: "Folguedos populares", descricao: "Guerreiro, pastoril e reisado em Alagoas." },
                { titulo: "Centro Histórico de Penedo", descricao: "Patrimônio cultural de Alagoas." },
                { titulo: "Influência afro-brasileira", descricao: "Muito forte nas tradições locais de Alagoas." },
                { titulo: "Música regional", descricao: "Forró e manifestações populares em Alagoas." },
                { titulo: "Museus históricos", descricao: "Preservação da memória estadual de Alagoas." },
                { titulo: "Festas tradicionais do interior", descricao: "Importantes para a cultura local de Alagoas." },
                { titulo: "Pelourinho", descricao: "Principal centro histórico do estado da Bahia." },
                { titulo: "Capoeira", descricao: "Uma das maiores expressões culturais baianas." },
                { titulo: "Blocos afros", descricao: "Elementos marcantes do carnaval baiano." },
                { titulo: "Candomblé", descricao: "Importante tradição religiosa da Bahia." },
                { titulo: "Samba de roda", descricao: "Patrimônio Cultural da Humanidade na Bahia." },
                { titulo: "Acarajé", descricao: "Símbolo da culinária e cultura baiana." },
                { titulo: "Trio elétrico", descricao: "Marca do carnaval de Salvador." },
                { titulo: "Festas de largo", descricao: "Fortemente presentes na cultura local da Bahia." },
                { titulo: "Influência africana", descricao: "Muito visível na música, religião e culinária baiana." },
                { titulo: "Artesanato baiano", descricao: "Grande diversidade de produtos artesanais." },
                { titulo: "Música baiana", descricao: "Axé, samba-reggae e outros ritmos." },
                { titulo: "Centro Histórico de Salvador", descricao: "Um dos mais importantes centros históricos do Brasil." },
                { titulo: "Centro Dragão do Mar", descricao: "Referência cultural cearense." },
                { titulo: "Jangadeiros", descricao: "Símbolo da cultura marítima do Ceará." },
                { titulo: "Humor cearense", descricao: "Reconhecido nacionalmente." },
                { titulo: "Praias e falésias", descricao: "Elementos marcantes da identidade local cearense." },
                { titulo: "Literatura popular", descricao: "Cordel muito valorizado no Ceará." },
                { titulo: "Rendeiras", descricao: "Importante tradição artesanal do Ceará." },
                { titulo: "Cultura sertaneja", descricao: "Forte influência no interior do Ceará." },
                { titulo: "Museus culturais de Fortaleza", descricao: "Preservação da história local." },
                { titulo: "Música forrozeira", descricao: "Parte essencial da identidade do estado do Ceará." },
                { titulo: "Artesanato em couro", descricao: "Muito difundido no Ceará." },
                { titulo: "Feiras culturais", descricao: "Espaços de expressão artística no Ceará." },
                { titulo: "Lençóis Maranhenses", descricao: "Principal símbolo natural e turístico do estado do Maranhão." },
                { titulo: "Casa das Tulhas", descricao: "Mercado tradicional de produtos regionais do Maranhão." },
                { titulo: "Reggae maranhense", descricao: "São Luís é conhecida como a 'Jamaica Brasileira'." },
                { titulo: "Azulejos portugueses", descricao: "Marca da arquitetura do centro histórico de São Luís." },
                { titulo: "Lenda da Serpente Encantada", descricao: "Uma das histórias mais famosas do folclore maranhense." },
                { titulo: "Centro Histórico de São Luís", descricao: "Patrimônio Mundial da UNESCO no Maranhão." },
                { titulo: "Culinária baseada em frutos do mar", descricao: "Muito presente na costa maranhense." },
                { titulo: "Matracas do Bumba Meu Boi", descricao: "Instrumentos característicos da festa maranhense." },
                { titulo: "Comunidades quilombolas", descricao: "Forte presença cultural no Maranhão." },
                { titulo: "Influência indígena na culinária", descricao: "Principalmente no uso da mandioca no Maranhão." },
                { titulo: "Festas populares de rua", descricao: "Grande participação comunitária no Maranhão." },
                { titulo: "Centro Histórico de João Pessoa", descricao: "Patrimônio arquitetônico da Paraíba." },
                { titulo: "Ponto mais oriental das Américas", descricao: "Marco cultural e turístico da Paraíba." },
                { titulo: "Literatura de cordel", descricao: "Grande tradição local na Paraíba." },
                { titulo: "Repentistas", descricao: "Destaque na cultura popular da Paraíba." },
                { titulo: "Arte popular paraibana", descricao: "Reconhecida nacionalmente." },
                { titulo: "Museu de Arte Popular", descricao: "Importante espaço cultural da Paraíba." },
                { titulo: "Cultura do algodão", descricao: "Influenciou a história econômica da Paraíba." },
                { titulo: "Bandas de pífano", descricao: "Elemento tradicional da música local paraibana." },
                { titulo: "Folguedos populares", descricao: "Muito presentes nas festas da Paraíba." },
                { titulo: "Artesanato em barro", descricao: "Produção tradicional da Paraíba." },
                { titulo: "Patrimônio histórico de Areia", descricao: "Cidade de relevância cultural na Paraíba." },
                { titulo: "Frevo", descricao: "Patrimônio Cultural Imaterial da Humanidade em Pernambuco." },
                { titulo: "Maracatu", descricao: "Símbolo da cultura afro-pernambucana." },
                { titulo: "Recife Antigo", descricao: "Centro histórico e cultural de Pernambuco." },
                { titulo: "Bonecos gigantes de Olinda", descricao: "Marca do carnaval local de Pernambuco." },
                { titulo: "Movimento Manguebeat", descricao: "Importante movimento musical de Pernambuco." },
                { titulo: "Instituto Ricardo Brennand", descricao: "Referência cultural em Pernambuco." },
                { titulo: "Artesanato de Caruaru", descricao: "Famoso em todo o país." },
                { titulo: "Música regional diversificada", descricao: "Frevo, coco, ciranda e maracatu em Pernambuco." },
                { titulo: "Centro Histórico de Olinda", descricao: "Patrimônio Mundial em Pernambuco." },
                { titulo: "Literatura popular", descricao: "Forte presença do cordel em Pernambuco." },
                { titulo: "Feira de Caruaru", descricao: "Uma das maiores feiras populares do Brasil." },
                { titulo: "Parque Nacional da Serra da Capivara", descricao: "Maior patrimônio arqueológico do Brasil no Piauí." },
                { titulo: "Arte rupestre", descricao: "Marca cultural do estado do Piauí." },
                { titulo: "Carnaúba", descricao: "Conhecida como 'árvore da vida' no Piauí." },
                { titulo: "Museus arqueológicos", descricao: "Importantes para a preservação histórica do Piauí." },
                { titulo: "Culinária sertaneja", descricao: "Fortemente ligada ao semiárido do Piauí." },
                { titulo: "Cultura vaqueira", descricao: "Presente em diversas cidades do Piauí." },
                { titulo: "Produção artesanal de palha", descricao: "Tradição regional do Piauí." },
                { titulo: "Comunidades rurais tradicionais", descricao: "Forte identidade cultural no Piauí." },
                { titulo: "Folclore sertanejo", descricao: "Histórias e lendas locais do Piauí." },
                { titulo: "Música nordestina tradicional", descricao: "Presença constante em festividades no Piauí." },
                { titulo: "Patrimônio histórico de Oeiras", descricao: "Antiga capital do estado do Piauí." },
                { titulo: "Forte dos Reis Magos", descricao: "Principal patrimônio histórico do Rio Grande do Norte." },
                { titulo: "Dunas de Genipabu", descricao: "Ícone turístico estadual do RN." },
                { titulo: "Cultura pesqueira", descricao: "Muito presente no litoral do RN." },
                { titulo: "Renda de bilro", descricao: "Artesanato tradicional do RN." },
                { titulo: "Festas religiosas populares", descricao: "Forte presença cultural no RN." },
                { titulo: "Museus históricos de Natal", descricao: "Preservação da memória potiguar." },
                { titulo: "Cultura sertaneja do Seridó", descricao: "Muito valorizada no RN." },
                { titulo: "Produção de bordados", descricao: "Artesanato regional do RN." },
                { titulo: "Folclore potiguar", descricao: "Rico em lendas e tradições no RN." },
                { titulo: "Grupos de dança popular", descricao: "Importantes em festividades no RN." },
                { titulo: "Influência indígena e portuguesa", descricao: "Base da identidade cultural do RN." },
                { titulo: "Cânion do Xingó", descricao: "Grande referência turística e cultural de Sergipe." },
                { titulo: "Chegança", descricao: "Folguedo típico sergipano." },
                { titulo: "Cacumbi", descricao: "Manifestação cultural afro-brasileira de Sergipe." },
                { titulo: "Artesanato em cerâmica", descricao: "Produção tradicional de Sergipe." },
                { titulo: "Centro Histórico de São Cristóvão", descricao: "Patrimônio Mundial em Sergipe." },
                { titulo: "Cultura ribeirinha", descricao: "Ligada ao Rio São Francisco em Sergipe." },
                { titulo: "Museus culturais", descricao: "Importantes para a preservação histórica de Sergipe." },
                { titulo: "Folclore regional", descricao: "Rico em tradições populares em Sergipe." },
                { titulo: "Produção artesanal de bordados", descricao: "Destaque econômico e cultural de Sergipe." },
                { titulo: "Festas religiosas tradicionais", descricao: "Muito presentes em Sergipe." },
                { titulo: "Influência indígena e africana", descricao: "Base da identidade cultural de Sergipe." }
            ]
        };

        function renderizarConteudo(estado, categoria) {
            const container = document.getElementById('conteudo-cultura');
            container.innerHTML = '';

            let dados = [];
            let titulo = '';

            if (estado === 'todos') {
                if (categoria === 'todas') {
                    dados = [
                        ...dadosGerais.girias.map(g => ({ ...g, tipo: 'giria' })),
                        ...dadosGerais.costumes.map(c => ({ ...c, tipo: 'costume' })),
                        ...dadosGerais.cultura.map(c => ({ ...c, tipo: 'cultura' }))
                    ];
                    titulo = 'Todas as Categorias - Nordeste';
                } else if (categoria === 'girias') {
                    dados = dadosGerais.girias.map(g => ({ ...g, tipo: 'giria' }));
                    titulo = 'Todas as Gírias Nordestinas';
                } else if (categoria === 'costumes') {
                    dados = dadosGerais.costumes.map(c => ({ ...c, tipo: 'costume' }));
                    titulo = 'Todos os Costumes do Nordeste';
                } else if (categoria === 'cultura') {
                    dados = dadosGerais.cultura.map(c => ({ ...c, tipo: 'cultura' }));
                    titulo = 'Toda a Cultura Local do Nordeste';
                }
            } else {
                const estadoDados = dadosCulturais[estado];
                if (!estadoDados) return;

                const nomeEstado = {
                    alagoas: 'Alagoas',
                    bahia: 'Bahia',
                    ceara: 'Ceará',
                    maranhao: 'Maranhão',
                    paraiba: 'Paraíba',
                    pernambuco: 'Pernambuco',
                    piaui: 'Piauí',
                    rn: 'Rio Grande do Norte',
                    sergipe: 'Sergipe'
                }[estado] || estado.charAt(0).toUpperCase() + estado.slice(1);

                if (categoria === 'todas') {
                    dados = [
                        ...estadoDados.girias.map(g => ({ ...g, tipo: 'giria' })),
                        ...estadoDados.costumes.map(c => ({ ...c, tipo: 'costume' })),
                        ...estadoDados.cultura.map(c => ({ ...c, tipo: 'cultura' }))
                    ];
                    titulo = `Todas as Categorias - ${nomeEstado}`;
                } else if (categoria === 'girias') {
                    dados = estadoDados.girias.map(g => ({ ...g, tipo: 'giria' }));
                    titulo = `Gírias - ${nomeEstado}`;
                } else if (categoria === 'costumes') {
                    dados = estadoDados.costumes.map(c => ({ ...c, tipo: 'costume' }));
                    titulo = `Costumes - ${nomeEstado}`;
                } else if (categoria === 'cultura') {
                    dados = estadoDados.cultura.map(c => ({ ...c, tipo: 'cultura' }));
                    titulo = `Cultura Local - ${nomeEstado}`;
                }
            }

            const tituloElement = document.createElement('h3');
            tituloElement.className = 'conteudo-titulo';
            tituloElement.innerHTML = `<i class="fa-solid fa-tag"></i> ${titulo}`;
            container.appendChild(tituloElement);

            const grid = document.createElement('div');
            grid.className = 'cultura-grid';

            dados.forEach(item => {
                const card = document.createElement('div');
                card.className = `card-cultura card-${item.tipo}`;

                if (item.tipo === 'giria') {
                    card.innerHTML = `
                        <span class="card-emoji">🗣️</span>
                        <div class="card-palavra">${item.palavra}</div>
                        <div class="card-significado">${item.significado}</div>
                        <div class="card-exemplo">"${item.exemplo}"</div>
                        <span class="card-tag">Gíria</span>
                    `;
                } else {
                    const emoji = item.tipo === 'costume' ? '🎭' : '🎨';
                    const tagText = item.tipo === 'costume' ? 'Costume' : 'Cultura';
                    card.innerHTML = `
                        <span class="card-emoji">${emoji}</span>
                        <div class="card-palavra">${item.titulo}</div>
                        <div class="card-significado">${item.descricao}</div>
                        <span class="card-tag card-tag-${item.tipo}">${tagText}</span>
                    `;
                }

                grid.appendChild(card);
            });

            container.appendChild(grid);
        }

        let estadoAtual = 'todos';
        let categoriaAtual = 'todas';

        const botoesEstado = document.querySelectorAll('.btn-estado');
        botoesEstado.forEach(btn => {
            btn.addEventListener('click', function() {
                botoesEstado.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                estadoAtual = this.dataset.estado;
                renderizarConteudo(estadoAtual, categoriaAtual);
            });
        });

        const botoesCategoria = document.querySelectorAll('.btn-categoria');
        botoesCategoria.forEach(btn => {
            btn.addEventListener('click', function() {
                botoesCategoria.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                categoriaAtual = this.dataset.categoria;
                renderizarConteudo(estadoAtual, categoriaAtual);
            });
        });

        renderizarConteudo('todos', 'todas');
    }
});