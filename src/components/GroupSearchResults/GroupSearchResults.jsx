export default function SearchResults(){

    const [results, setResults] = useState([]);
  
    useEffect(() => {
      const fetchResults = async () => {
        const response = await axios.get('/api/searchResults');
        setResults(response.data);
      };
  
      fetchResults();
    }, []);
  
    // Render your UI here
  }