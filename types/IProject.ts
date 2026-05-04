import mongoose, { Document } from "mongoose";

export interface IProject extends Document {
  name:             string;
  trackerCode:      string;
  projectManagerId: mongoose.Types.ObjectId;
  clientName:       string;
  clientBusiness:   string;
  isArchived:       boolean;
  createdAt:        Date;
  updatedAt:        Date;
}

export interface ProjectData {
  id:                 string;
  name:               string;
  trackerCode:        string;
  projectManagerId:   string;
  projectManagerName: string;
  clientName:         string;
  clientBusiness:     string;
  isArchived:         boolean;
  createdAt:          string;
}

export interface ProjectManagerOption {
  id:    string;
  name:  string;
  email: string;
}