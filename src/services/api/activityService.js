import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll(limit = 20) {
    try {
      await delay(300);
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "entity_type_c"}},
          {"field": {"Name": "entity_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      toast.error("Failed to load activities");
      return [];
    }
  },

  async getByEntityId(entityType, entityId, limit = 10) {
    try {
      await delay(300);
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "entity_type_c"}},
          {"field": {"Name": "entity_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        where: [
          {"FieldName": "entity_type_c", "Operator": "ExactMatch", "Values": [entityType]},
          {"FieldName": "entity_id_c", "Operator": "ExactMatch", "Values": [parseInt(entityId)]}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activities for ${entityType} ${entityId}:`, error?.response?.data?.message || error);
      return [];
    }
  },

  async create(activityData) {
    try {
      await delay(300);
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          type_c: activityData.type_c,
          entity_type_c: activityData.entity_type_c,
          entity_id_c: activityData.entity_id_c,
          description_c: activityData.description_c,
          timestamp_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      return null;
    }
  }
};