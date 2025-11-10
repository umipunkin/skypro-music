export const staticTracks = [
    {
      id: 1,
      title: "Guilt",
      subtitle: "",
      author: "Nero",
      album: "Welcome Reality",
      duration: "4:44",
      url: "#",
      artistUrl: "#",
      albumUrl: "#"
    },
    {
      id: 2,
      title: "Elektro",
      subtitle: "",
      author: "Dynoro, Outwork, Mr. Gee",
      album: "Elektro",
      duration: "2:22",
      url: "#",
      artistUrl: "#",
      albumUrl: "#"
    },
    {
      id: 3,
      title: "I'm Fire",
      subtitle: "",
      author: "Ali Bakgor",
      album: "I'm Fire",
      duration: "2:22",
      url: "#",
      artistUrl: "#",
      albumUrl: "#"
    }
  ];
  
  export const tracksAPI = {
    getAllTracks: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: staticTracks,
            status: 200
          });
        }, 500);
      });
    },
  
    searchTracks: (query) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filteredTracks = staticTracks.filter(track => 
            track.title.toLowerCase().includes(query.toLowerCase()) ||
            track.author.toLowerCase().includes(query.toLowerCase()) ||
            track.album.toLowerCase().includes(query.toLowerCase())
          );
          resolve({
            data: filteredTracks,
            status: 200
          });
        }, 300);
      });
    }
  };