export function random_sampling_seq(n, rate = 0.05) {
    const seq = [];
    for (let i = Math.floor(Math.random() / rate); i < n; i += Math.ceil(Math.random() / rate)) {
        seq.push(i);
    }
    return seq;
}

export function random_sampling(data, rate = 0.05) {
    const seq = random_sampling_seq(data.length, rate);
    for (let i = 0; i < seq.length; ++i) {
        seq[i] = data[seq[i]];
    }
    return seq;
}
