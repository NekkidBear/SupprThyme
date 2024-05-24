export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);

  const handleCreateGroup = async () => {
    // Create the group on the server
    const response = await axios.post('/api/groups', {
      name: groupName,
      friends: selectedFriends,
    });

    // Navigate to the search results screen
    history.push('/searchResults');
  };

  // Render your UI here
}