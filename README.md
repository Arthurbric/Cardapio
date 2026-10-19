# 🍸 Cardápio de Bebidas · Formatura do Arthur

Cardápio digital de drinks com tema de TI, feito para a comemoração de formatura do Arthur Arash. Cada drink tem um "nome de código" (`mint.deploy()`, `kernel.colada()`...) e, ao clicar, mostra a foto e os ingredientes completos.

🔗 **Site:** [drinks.arash.com.br](https://drinks.arash.com.br)

<p align="center">
  <img src="https://mapadacachaca.com.br/wp-content/uploads/2024/11/Caipirinha-Famigerada-optimized.webp" alt="Caipirinha" width="30%" />
  <img src="https://kitchenswagger.com/wp-content/uploads/2020/07/mojito-recipe_0009_DSC_5509.jpg" alt="Mojito" width="30%" />
  <img src="https://m.media-amazon.com/images/I/710KvvfKVsL.jpg" alt="Piña Colada" width="30%" />
</p>

## ✨ Funcionalidades

- **Filtro por bebida base:** Todos, Cachaça, Vodca ou Rum, com contador de drinks.
- **Detalhes em modal:** foto, base, ingredientes e descrição de cada drink.
- **Animações com GSAP:** entrada em sequência, cards que aparecem ao rolar, barra de progresso e emoji que "pula" no hover.
- **Leve e acessível:** só anima `transform` e `opacity`, navegação por teclado (`Enter`, `Espaço`, `Esc`) e respeita "reduzir movimento".
- **Responsivo:** funciona bem no celular, que é onde os convidados vão abrir.

## 🍹 O cardápio

| Código | Drink | Base |
| --- | --- | --- |
| `root.caipi()` | Caipirinha / Caipiroska / Daiquiri | Cachaça, vodca ou rum |
| `mint.deploy()` | Mojito | Rum |
| `passion.commit()` | Batida de Maracujá | Cachaça |
| `kernel.colada()` | Piña Colada | Rum |
| `pink.packet()` | Pink Lemon | Vodca ou rum |
| `sunset.compile()` | Vodca com Suco de Laranja | Vodca |

<p align="center">
  <img src="https://www.receitasnestle.com.br/sites/default/files/styles/recipe_detail_mobile/public/srh_recipes/cbe8fbdd5dd73dd09eb8912d4501b71d.jpeg?itok=vTPyFzy1" alt="Batida de Maracujá" width="30%" />
  <img src="https://www.absolutdrinks.com/cdn-cgi/image/fit=cover,format=auto,height=414,quality=55,width=414/wp-content/uploads/drink_pink-lemonade_16x9.png" alt="Pink Lemon" width="30%" />
  <img src="https://heybairtender.s3.amazonaws.com/recipes/caribbean-sunset5543_TITAN.png" alt="Vodca com Suco de Laranja" width="30%" />
</p>

## 🛠️ Tecnologias

- HTML, CSS e JavaScript puros, em um único arquivo (`index.html`)
- [GSAP 3](https://gsap.com/) + ScrollTrigger (via CDN) para as animações
- Fontes [Inter](https://fonts.google.com/specimen/Inter) e [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- Hospedado no GitHub Pages com domínio próprio (`CNAME`)

## ▶️ Como rodar

Não precisa instalar nada. Abra o `index.html` no navegador ou use um servidor local:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## ➕ Como adicionar um drink

No `index.html`, adicione um objeto ao array `drinks`:

```js
{
  emoji: '🍓',
  bases: ['vodca'],
  codename: 'berry.merge()',
  realName: 'Nome do drink',
  shortText: 'Resumo curto exibido no card',
  ingredients: ['Ingrediente 1', 'Ingrediente 2'],
  description: 'Descrição exibida no modal.',
  image: 'https://link-da-foto.jpg'
}
```

O card, o filtro e o contador se atualizam sozinhos.

## 🍸 Créditos

- Drinks por [@fabio_drinksdf](https://instagram.com/fabio_drinksdf)
- Criado por Arthur Arash Briceño Heidari
