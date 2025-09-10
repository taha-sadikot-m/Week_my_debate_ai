import type { HumanDebateRecord, ChatMessage, Participant } from '@/types/debate';

class DebateHistoryService {
  private storageKey = 'temporary_debate_history';
  private maxRecords = 100; // Maximum number of records to keep

  initialize() {
    if (typeof window === 'undefined') return;
    
    // Initialize storage if it doesn't exist
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  async saveDebate(debateRecord: HumanDebateRecord): Promise<void> {
    try {
      this.initialize();
      const existingRecords = await this.getAllDebates();
      
      // Check if debate already exists and update it
      const existingIndex = existingRecords.findIndex((record: HumanDebateRecord) => record.id === debateRecord.id);
      
      if (existingIndex >= 0) {
        // Update existing record
        existingRecords[existingIndex] = debateRecord;
      } else {
        // Add new record
        existingRecords.unshift(debateRecord);
        
        // Limit the number of records
        if (existingRecords.length > this.maxRecords) {
          existingRecords.splice(this.maxRecords);
        }
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(existingRecords));
      console.log(`💾 Saved debate: ${debateRecord.topic} (${debateRecord.status})`);
    } catch (error) {
      console.error('Error saving debate:', error);
      throw error;
    }
  }

  async getAllDebates(): Promise<HumanDebateRecord[]> {
    try {
      this.initialize();
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const records = JSON.parse(data) as HumanDebateRecord[];
      return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error loading debates:', error);
      return [];
    }
  }

  async getDebateById(id: string): Promise<HumanDebateRecord | null> {
    try {
      const records = await this.getAllDebates();
      return records.find(record => record.id === id) || null;
    } catch (error) {
      console.error('Error getting debate by ID:', error);
      return null;
    }
  }

  async updateDebateStatus(id: string, status: 'waiting' | 'active' | 'completed', endedAt?: string): Promise<void> {
    try {
      const records = await this.getAllDebates();
      const recordIndex = records.findIndex((record: HumanDebateRecord) => record.id === id);
      
      if (recordIndex >= 0) {
        records[recordIndex].status = status;
        if (endedAt) {
          records[recordIndex].endedAt = endedAt;
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(records));
        console.log(`📝 Updated debate status: ${id} -> ${status}`);
      }
    } catch (error) {
      console.error('Error updating debate status:', error);
      throw error;
    }
  }

  async addMessageToDebate(debateId: string, message: ChatMessage): Promise<void> {
    try {
      const records = await this.getAllDebates();
      const recordIndex = records.findIndex(record => record.id === debateId);
      
      if (recordIndex >= 0) {
        records[recordIndex].messages.push(message);
        localStorage.setItem(this.storageKey, JSON.stringify(records));
        console.log(`💬 Added message to debate: ${debateId}`);
      }
    } catch (error) {
      console.error('Error adding message to debate:', error);
      throw error;
    }
  }

  async addParticipantToDebate(debateId: string, participant: Participant): Promise<void> {
    try {
      const records = await this.getAllDebates();
      const recordIndex = records.findIndex(record => record.id === debateId);
      
      if (recordIndex >= 0) {
        // Check if participant already exists
        const existingIndex = records[recordIndex].participants.findIndex((p: Participant) => p.id === participant.id);
        
        if (existingIndex >= 0) {
          // Update existing participant
          records[recordIndex].participants[existingIndex] = participant;
        } else {
          // Add new participant
          records[recordIndex].participants.push(participant);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(records));
        console.log(`👤 Added/updated participant in debate: ${debateId}`);
      }
    } catch (error) {
      console.error('Error adding participant to debate:', error);
      throw error;
    }
  }

  async deleteDebate(id: string): Promise<void> {
    try {
      const records = await this.getAllDebates();
      const filteredRecords = records.filter(record => record.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredRecords));
      console.log(`🗑️ Deleted debate: ${id}`);
    } catch (error) {
      console.error('Error deleting debate:', error);
      throw error;
    }
  }

  async clearAllDebates(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('🧹 Cleared all debate history');
    } catch (error) {
      console.error('Error clearing debates:', error);
      throw error;
    }
  }

  async getStorageStats(): Promise<{ totalRecords: number; totalSize: string; oldestRecord?: string; newestRecord?: string }> {
    try {
      const records = await this.getAllDebates();
      const dataSize = localStorage.getItem(this.storageKey)?.length || 0;
      
      return {
        totalRecords: records.length,
        totalSize: `${(dataSize / 1024).toFixed(2)} KB`,
        oldestRecord: records.length > 0 ? records[records.length - 1]?.createdAt : undefined,
        newestRecord: records.length > 0 ? records[0]?.createdAt : undefined
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return { totalRecords: 0, totalSize: '0 KB' };
    }
  }

  downloadJSON(): void {
    try {
      const records = this.getAllDebates();
      const dataStr = JSON.stringify(records, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `debate_history_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      console.log('📥 Downloaded debate history as JSON');
    } catch (error) {
      console.error('Error downloading debate history:', error);
      throw error;
    }
  }

  importFromJSON(jsonData: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const records = JSON.parse(jsonData) as HumanDebateRecord[];
        
        // Validate records structure
        const validRecords = records.filter(record => 
          record.id && 
          record.topic && 
          record.hostName && 
          Array.isArray(record.participants) && 
          Array.isArray(record.messages)
        );
        
        localStorage.setItem(this.storageKey, JSON.stringify(validRecords));
        console.log(`📤 Imported ${validRecords.length} debate records`);
        resolve();
      } catch (error) {
        console.error('Error importing debate history:', error);
        reject(error);
      }
    });
  }

  // Search and filter methods
  async searchDebates(query: string): Promise<HumanDebateRecord[]> {
    try {
      const records = await this.getAllDebates();
      const lowerQuery = query.toLowerCase();
      
      return records.filter(record => 
        record.topic.toLowerCase().includes(lowerQuery) ||
        record.hostName.toLowerCase().includes(lowerQuery) ||
        record.participants.some((p: Participant) => p.name.toLowerCase().includes(lowerQuery)) ||
        record.messages.some((m: ChatMessage) => m.text.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching debates:', error);
      return [];
    }
  }

  async getDebatesByStatus(status: 'waiting' | 'active' | 'completed'): Promise<HumanDebateRecord[]> {
    try {
      const records = await this.getAllDebates();
      return records.filter(record => record.status === status);
    } catch (error) {
      console.error('Error filtering debates by status:', error);
      return [];
    }
  }

  async getDebatesByParticipant(participantId: string): Promise<HumanDebateRecord[]> {
    try {
      const records = await this.getAllDebates();
      return records.filter(record => 
        record.participants.some((p: Participant) => p.id === participantId)
      );
    } catch (error) {
      console.error('Error filtering debates by participant:', error);
      return [];
    }
  }
}

// Export singleton instance
export const debateHistoryService = new DebateHistoryService(); 