const DRINKS = [
    //Biere
    { key: '1', cat: 1, label: 'Augustiner', price: 2.8 },
    { key: '2', cat: 1, label: 'Commerzienrat', price: 2.8 },
    { key: '3', cat: 1, label: 'Hell Alkoholfrei', price: 2.8 },
    { key: '4', cat: 1, label: 'Kellerbier', price: 2.8 },
    { key: '5', cat: 1, label: 'Speziator', price: 2.8 },
    { key: '6', cat: 1, label: 'Edelstoff', price: 2.8 },
    { key: '7', cat: 1, label: 'Radler', price: 2.8 },
    { key: '8', cat: 1, label: 'Aechtes Dunkel', price: 2.8 },
    { key: '9', cat: 1, label: 'Hefe Weisse', price: 2.8 },
    { key: '10', cat: 1, label: 'Leichte Weisse', price: 2.8 },
    { key: '11', cat: 1, label: 'Weisse Alkoholfrei', price: 2.8 },
    { key: '12', cat: 1, label: 'Alte Weisse', price: 2.8 },
    { key: '13', cat: 1, label: 'Coca Weizen', price: 2.8 },
    { key: '14', cat: 1, label: 'Herren Pils', price: 2.8 },
    { key: '15', cat: 1, label: 'Maß Kirsch Goiß', price: 7 },
    { key: '16', cat: 1, label: 'Gespritzter', price: 2.5 },
    { key: '17', cat: 1, label: 'Ouzo', price: 1.8 },
    { key: '18', cat: 1, label: 'Ramazzotti', price: 2.5 },
    { key: '19', cat: 1, label: 'Long Drink', price: 5 },
    //Sodas
    { key: '20', cat: 2, label: 'Spezi', price: 2.7 },
    { key: '21', cat: 2, label: 'Spezi Energy', price: 2.7 },
    { key: '22', cat: 2, label: 'Coca Cola', price: 2.7 },
    { key: '23', cat: 2, label: 'Stilles Wasser', price: 2.7 },
    { key: '24', cat: 2, label: 'Spritziges Wasser', price: 2.7 },
    { key: '25', cat: 2, label: 'Weisses Limo', price: 2.7 },
    { key: '26', cat: 2, label: 'Saft', price: 2.9 },
    { key: '27', cat: 2, label: 'Schorle', price: 2.9 },
    { key: '28', cat: 2, label: 'Dose Red Bull', price: 2.8 },
    { key: '29', cat: 2, label: 'Tasse Kaffee', price: 1.8 },
    //Speisen
    { key: '30', cat: 3, label: 'Salami', price: 7 },
    { key: '31', cat: 3, label: 'Schinken', price: 7 },
    { key: '32', cat: 3, label: 'Spezial', price: 7 },
    { key: '33', cat: 3, label: 'Diabolo', price: 7 },
    { key: '34', cat: 3, label: 'Hawaii', price: 7 },
    { key: '35', cat: 3, label: 'Thunfisch', price: 7 },
    { key: '36', cat: 3, label: 'Tomoba', price: 7 },
    { key: '37', cat: 3, label: 'Sußes', price: 1 },
]

// const beers = [
//     { key: '1', label: 'augustiner', price: 2.7 },
//     { key: '2', label: 'hefeweizen', price: 2.8 },
//     { key: '3', label: 'kellerbier', price: 2.7 },
//     { key: '4', label: 'leichte weisse', price: 2.7 },
//     { key: '5', label: 'alte weisse', price: 2.7 },
// ]

// const softs = [
//     { key: '6', label: 'Wasser Spritzig', price: 2.7 },
//     { key: '7', label: 'Wasser Natur', price: 2.8 },
//     { key: '8', label: 'Spezi', price: 2.7 },
//     { key: '9', label: 'Spezi Energy', price: 2.7 },
//     { key: '10', label: 'alte weisse', price: 2.7 },
// ]

// const spirits = [
//     { key: '11', label: 'Jack & Cola', price: 2.7 },
//     { key: '12', label: 'Gin & Tonic', price: 2.8 },
//     { key: '13', label: 'Gin & Lemon', price: 2.7 },
// ]

// const extras = [
//     { key: '14', label: 'Snackbar', price: 2.7 },
//     { key: '15', label: 'Coffee', price: 2.8 },
//     { key: '16', label: 'Pizza', price: 2.7 },
// ]

// const prices = [
//     { id: 1, price: 2.7 },
//     { id: 2, price: 3 },
//     { id: 3, price: 3.2 },
//     { id: 4, price: 2.7 },
//     { id: 5, price: 2.7 },
//     { id: 6, price: 2.7 },
//     { id: 7, price: 2.7 },
//     { id: 8, price: 2.7 },
//     { id: 9, price: 2.7 },
//     { id: 10, price: 2.7 },
//     { id: 11, price: 2.7 },
//     { id: 12, price: 2.7 },
//     { id: 13, price: 2.7 },
//     { id: 14, price: 2.7 },
//     { id: 15, price: 2.7 },
//     { id: 16, price: 2.7 },
//     { id: 17, price: 2.7 },
//     { id: 18, price: 2.7 },
//     { id: 19, price: 2.7 },
//     { id: 20, price: 2.7 },
//     { id: 21, price: 2.7 },
//     { id: 22, price: 2.7 },
// ]

export { DRINKS }

// export const DRINK_LIST = [{
//         key: '1',
//         label: 'Biere',
//         children: [
//             { key: '1', label: 'augustiner', price: 2.7 },
//             { key: '2', label: 'hefeweizen', price: 2.8 },
//             { key: '3', label: 'kellerbier', price: 2.7 },
//             { key: '4', label: 'leichte weisse', price: 2.7 },
//             { key: '5', label: 'alte weisse', price: 2.7 },
//         ],
//     },
//     {
//         key: '2',
//         label: 'Softs',
//         children: [
//             { key: '6', label: 'Wasser Spritzig', price: 2.7 },
//             { key: '7', label: 'Wasser Natur', price: 2.8 },
//             { key: '8', label: 'Spezi', price: 2.7 },
//             { key: '9', label: 'Spezi Energy', price: 2.7 },
//             { key: '10', label: 'alte weisse', price: 2.7 },
//         ],
//     },
//     {
//         key: '3',
//         label: 'Spirits',
//         children: [
//             { key: '1', label: 'Jack & Cola', price: 2.7 },
//             { key: '2', label: 'hefeweizen', price: 2.8 },
//             { key: '3', label: 'kellerbier', price: 2.7 },
//             { key: '4', label: 'leichte weisse', price: 2.7 },
//             { key: '5', label: 'alte weisse', price: 2.7 },
//         ],
//     },
//     {
//         key: '4',
//         label: 'Extra',
//         children: [
//             { key: '1', label: 'augustiner', price: 2.7 },
//             { key: '2', label: 'hefeweizen', price: 2.8 },
//             { key: '3', label: 'kellerbier', price: 2.7 },
//             { key: '4', label: 'leichte weisse', price: 2.7 },
//             { key: '5', label: 'alte weisse', price: 2.7 },
//         ],
//     },
// ]