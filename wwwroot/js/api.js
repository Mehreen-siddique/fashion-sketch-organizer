// API Service for Fashion Sketch Organizer

const api = {
    baseUrl: '', // Empty string for relative URLs to current host

    // Sketch API calls
    sketches: {
        getAll: async () => {
            try {
                const response = await axios.get(`${api.baseUrl}/Getsketches/0`);
                return response.data;
            } catch (error) {
                throw new Error('Failed to fetch sketches');
            }
        },

        create: async (sketch) => {
            try {
                const response = await axios.post(`${api.baseUrl}/sketches`, sketch);
                return response.data;
            } catch (error) {
                throw new Error('Failed to create sketch');
            }
        },

        update: async (sketch) => {
            try {
                const response = await axios.put(`${api.baseUrl}/Updatesketches`, sketch);
                return response.data;
            } catch (error) {
                throw new Error('Failed to update sketch');
            }
        },

        delete: async (id) => {
            try {
                const response = await axios.delete(`${api.baseUrl}/Deletesketches/${id}`);
                return response.data;
            } catch (error) {
                throw new Error('Failed to delete sketch');
            }
        }
    },

    // Designer API calls
    designers: {
        getAll: async () => {
            try {
                const response = await axios.get(`${api.baseUrl}/Getdesigners/0`);
                return response.data;
            } catch (error) {
                throw new Error('Failed to fetch designers');
            }
        },

        create: async (designer) => {
            try {
                const response = await axios.post(`${api.baseUrl}/designers`, designer);
                return response.data;
            } catch (error) {
                throw new Error('Failed to create designer');
            }
        },

        update: async (designer) => {
            try {
                const response = await axios.put(`${api.baseUrl}/Updatedesigners`, designer);
                return response.data;
            } catch (error) {
                throw new Error('Failed to update designer');
            }
        },

        delete: async (id) => {
            try {
                const response = await axios.delete(`${api.baseUrl}/Deletedesigners/${id}`);
                return response.data;
            } catch (error) {
                throw new Error('Failed to delete designer');
            }
        }
    },

    // Tag API calls
    tags: {
        getAll: async () => {
            try {
                const response = await axios.get(`${api.baseUrl}/Gettags/0`);
                return response.data;
            } catch (error) {
                throw new Error('Failed to fetch tags');
            }
        },

        create: async (tag) => {
            try {
                const response = await axios.post(`${api.baseUrl}/tags`, tag);
                return response.data;
            } catch (error) {
                throw new Error('Failed to create tag');
            }
        },

        update: async (tag) => {
            try {
                const response = await axios.put(`${api.baseUrl}/Updatetags`, tag);
                return response.data;
            } catch (error) {
                throw new Error('Failed to update tag');
            }
        },

        delete: async (id) => {
            try {
                const response = await axios.delete(`${api.baseUrl}/Deletetags/${id}`);
                return response.data;
            } catch (error) {
                throw new Error('Failed to delete tag');
            }
        }
    }
};
