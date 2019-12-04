alleles = d3.json('../data/m1e-2_mu1e-6_r1e-6_sigsqr5_alleles_md.json');

Promise.all([alleles]).then((values) => {
    let data = values[0];
    console.log(data);

    // let mutations = d3.nest()
    //     .key(d => [d.output_gen, d.position, d.pop])
    //     .rollup(v => v.length/2000)
    //     .entries(data);
    
    let mutations = [];
    d3.nest()
        .key(d => [d.output_gen, d.position, d.pop])
        // .key(d => d.output_gen)
        // .key(d => d.position)
        // .key(d => d.pop)
        .rollup(v => v.length/2000)
        .entries(data)
        .forEach(element => {
            let vals = element.key.split(",").map(x => parseInt(x));
            element['output_gen'] = vals[0];
            element['position'] = vals[1];
            element['pop'] = vals[2];
            mutations.push(element);
        });

    console.log(mutations);


})