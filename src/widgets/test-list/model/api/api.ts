import api from "../../../../shared/api/axiosInstance";
import { Test } from "../../../../entities/test/card-test/model";

export const fetchAllTests = async (): Promise<Test[]> => {
  const response = await api.get<{ tests: Test[] }>("/api/tests/all");
  return response.data.tests;
};