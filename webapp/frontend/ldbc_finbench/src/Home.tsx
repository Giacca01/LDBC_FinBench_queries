// componente che modella la home page
// contenente la descrizione del progetto
function Home(){
    return(
        <main
            className="flex flex-col items-center justify-center min-h-screen px-6"
            style={{ backgroundColor: "rgb(8, 20, 45)"}} // a nice dark blue, not too dark
        >
            <h1 className="text-white text-4xl font-bold mb-6 select-none">
                LDBC Finbech Project
            </h1>
            <p className="max-w-3xl text-white text-justify text-xl leading-relaxed">
                This website serves as a demo for the final project developed for 
                the MAADB course, held at the University of Turin, duruing the academic year 2024/2025.
                The project aim at developing and testing analytic and look queries on graph and
                document-based datastores, populated with data from the LDBC Finbench Project.
                In the corresponding sections, you can request queries execution, and visualize their
                results.
            </p>
        </main>
    );
}

export default Home;