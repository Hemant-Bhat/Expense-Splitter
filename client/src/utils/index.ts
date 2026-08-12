const getRandomColor = () => {
    const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += values[Math.round(Math.random() * 15)];
    }
    return color;
};

export { getRandomColor };
