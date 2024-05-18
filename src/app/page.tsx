'use client'

import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { Avatar, Button, Flex, Heading, Icon, Input, InputGroup, InputLeftElement, Select, Spinner, Square, Table, TableCaption, Tag, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { IoMdFunnel } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiSolidDownArrow } from "react-icons/bi";
import { HiPencilSquare } from "react-icons/hi2";
import { FaTrashAlt } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";
import { GiHouse } from "react-icons/gi";
import Employee from "@/types/employee";
import { useEffect, useState } from "react";
import api from "@/services";
import { useRouter } from "next/navigation";
import moment from "moment";


export default function Home() {

  const [employees, setEmployees] = useState<null | Employee[]>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [sort, setSort] = useState("department");

  const sortEmployees = async() => {

    setLoading(true);

    try{
      const response = await api.get(`/employees?sort=${sort}`);

      if(response?.status === 200){
        setEmployees(response?.data)
        setLoading(false);
      }

    }catch(error){
      return toast({
        title: `${error}`,
        status: "error",
        isClosable: true
      })
    }
  }

  const fetchEmployees = async() => {

    setLoading(true);

    try{
      const response = await api.get("/employees");

      if(response?.status === 200){
        setEmployees(response?.data)
        setLoading(false);
      }

    }catch(error){
      return toast({
        title: `${error}`,
        status: "error",
        isClosable: true
      })
    }
  }

  const deleteEmployee = async(id: string) => {
    setLoading(true);

    try{
      const response = await api.delete(`/employees/${id}`);

      if(response?.status === 200){
        setLoading(false);
        await fetchEmployees();
        return toast({
          title: `Funcionário deletado com sucesso`,
          status: "success",
          isClosable: true
        })
      }

    }catch(error){
      return toast({
        title: `${error}`,
        status: "error",
        isClosable: true
      })
    }
  }

  useEffect(()=>{
    fetchEmployees();
  }, [])

  useEffect(()=>{
    sortEmployees();
  }, [sort])

  return (
    <Flex w="100%" minH="100vh" maxH="auto" >
      <Flex flexDirection="column" w="256px" minH="100vh" maxH="auto" bg="gray.900" >
        <Flex h="70px" px="5" alignItems="center" borderBottom="1px solid" borderBottomColor="gray.800" >
          <Square size="30px" mr="3" borderRadius="4" bg="white" >
            <Icon as={FaCrown} color="gray.900" />
          </Square>
          <Text fontSize="sm" color="white" >RBR Digital</Text>
        </Flex>

        <Flex px="5" mt="5" >
          <Icon as={GiHouse} fontSize="xl" mr="3" color="gray.500" />
          <Text fontSize="sm" color="gray.500" >Home</Text>
        </Flex>
      </Flex>
      <Flex w="100%" flexDirection="column" >
        <Flex w="100%" px="7" alignItems="center" justifyContent="space-between" h="80px" bg="white">
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='gray.300' />
            </InputLeftElement>
            <Input type='tel' borderRadius="3px" w="40%" bg="gray.50" border="none" fontSize="sm" placeholder='Procure um funcionário pelo nome' />
          </InputGroup>
          <Flex alignItems="center" >
            <Icon as={IoMailOutline} fontSize="2xl" mr="7" color="gray.300" />
            <Icon as={IoNotificationsOutline} fontSize="2xl" color="gray.300" />
            <Flex ml="10" w="9rem" justifyContent="space-between" alignItems="center">
              <Text color="gray.300" fontSize="sm" >RBR Digital</Text>
              <Avatar size='sm' name='RBR Digital' src="https://media.licdn.com/dms/image/C4D0BAQHY9sJuSlFm0A/company-logo_200_200/0/1633627954150?e=2147483647&v=beta&t=bZADapIRKyKmrETObgCp8VOfRAXPOM08lYrhyQPm438" />
              <Icon as={BiSolidDownArrow} color="gray.400" />
            </Flex>
          </Flex>
        </Flex> 
        <Flex w="100%" h="100%" bg="gray.50" p="32px" flexDirection="column" >
        {loading ? <Spinner/> : <>
        
        
        <Flex px="5" w="100%" bg="white" h="60px" alignItems="center" justifyContent="space-between" >
          <Text fontWeight="medium" fontSize="xl" >Funcionários</Text>
          <Flex>
            <Select bg="gray.50" placeholder="Ordenar por" value={sort} onChange={(e)=>setSort(e.target.value)} size="sm" border="none" w="10rem" >
              <option value='name'>Nome</option>
              <option value='role'>Cargo</option>
              <option value='department'>Departamento</option>
              <option value="admissionDate">Data de admissão</option>
            </Select>
            <Button ml="3" bg="blackAlpha.900" onClick={()=> router.push("/create")} leftIcon={<AddIcon color="white" />} color="white" size="sm" >Add Funcionário</Button>
          </Flex>
        </Flex>
         
        <Table variant='simple' bg="white" >
              <Thead>
                <Tr>
                  <Th color="black" >Nome</Th>
                  <Th color="black" >Cargo</Th>
                  <Th color="black">Departamento</Th>
                  <Th color="black">Data Admissão</Th>
                  <Th color="black" >Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {employees?.map((item)=>(
                  <Tr>
                    <Td fontSize="sm" >{item?.name}</Td>
                    <Td fontSize="sm" >{item?.role}</Td>
                    <Td fontSize="sm" >{item?.department}</Td>
                    <Td fontSize="sm" >{moment(item?.admissionDate).format('L')}</Td>
                    <Td display="flex" >
                      <Icon as={HiPencilSquare} cursor="pointer" onClick={()=> router.push(`/edit/${item?._id}`)} fontSize="xl" />
                      <Icon as={FaTrashAlt} cursor="pointer" ml="3" onClick={()=> deleteEmployee(item?._id)} fontSize="xl" color="red.400" />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            </>}
        </Flex>
      </Flex>
    </Flex>
  );
}
